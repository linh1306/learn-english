import { Injectable } from '@nestjs/common';
import { MessengerClient } from 'messaging-api-messenger';
import { GeminiService } from '../gemini/gemini.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { MetaDataUsers, Vocabularies } from '@prisma/client';
import { MetaDataUsersEntity } from '@type/models/entity/metadatausers.entity';
import {
  TInputChatGemini,
  TOutputChatGemini,
} from '@app/gemini/folws/chat.flow';
import CONFIG from '@app/common/config/index.config';

@Injectable()
export class FacebookService {
  private client: MessengerClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {
    this.client = new MessengerClient({
      accessToken: CONFIG.tokenFacebook.accessToken,
      appSecret: CONFIG.tokenFacebook.appSecret,
    });
  }

  async checkLogin(userFbId: string): Promise<MetaDataUsersEntity | null> {
    const metaDataUser = await this.prisma.metaDataUsers.findFirst({
      where: { facebookId: userFbId },
      include: { topic: true, user: true },
    });
    if (!metaDataUser) {
      return null;
    }
    return metaDataUser;
  }

  async chat(
    userFbId: string,
    message: string,
    metaDataUser: MetaDataUsersEntity,
  ) {
    const { topic, level, typeLevel, profile } = metaDataUser;

    const vocabulary = await this.getVocabulary(metaDataUser.userId);

    const resGemini = await this.gemini.chatGemini({
      userSentence: message,
      topic: topic?.name ?? '',
      userLevel: level + typeLevel,
      userProfile: profile,
      vocabularyList:
        vocabulary.length > 0 ? vocabulary.map((item) => item.context) : [],
    });
    const word = resGemini.suggestedVocabulary[0].word ?? '******';

    resGemini.reply = resGemini.reply.replace(
      new RegExp(`\\b${word}\\b`, 'g'),
      `[${word}]`,
    );

    await this.saveNewMetaData(metaDataUser, resGemini);

    if (resGemini.correction) this.sendText(userFbId, resGemini.correction);
    this.sendTip(userFbId, resGemini);
    this.sendReplyGemini(userFbId, resGemini);
  }

  async getVocabulary(userId: string) {
    const numberWord = 2;
    const vocabulary = await this.prisma.$queryRaw<Vocabularies[]>`
      WITH today_count AS (
        SELECT COUNT(*) AS count
        FROM "Vocabularies" v
        JOIN "Topics" t ON v."topicId" = t."id"
        WHERE t."userId" = ${userId}
          AND DATE(v."learnedAt") = CURRENT_DATE
      ),
    selected_vocab AS (
      SELECT v."id"
      FROM "Vocabularies" v
      JOIN "Topics" t ON v."topicId" = t."id"
      WHERE t."userId" = ${userId}
        AND (
          (
            (SELECT count FROM today_count) >= ${numberWord}
            AND DATE(v."learnedAt") = CURRENT_DATE
            -- loại các bản ghi có learnedAt = max(nhằm tránh bị chọn lại)
            AND v."learnedAt" < (
              SELECT MAX(v2."learnedAt")
              FROM "Vocabularies" v2
              JOIN "Topics" t2 ON v2."topicId" = t2."id"
              WHERE t2."userId" = ${userId}
                AND DATE(v2."learnedAt") = CURRENT_DATE
            )
          )
          OR ((SELECT count FROM today_count) < ${numberWord})
        )
      ORDER BY v."learnedAt" ASC
      LIMIT 1
    ),
    updated AS (
      UPDATE "Vocabularies"
      SET "studyCount" = "studyCount" + 1,
          "learnedAt" = NOW()
      WHERE "id" IN (SELECT "id" FROM selected_vocab)
      RETURNING *
    )
    SELECT * FROM updated;`;
    console.log('vocabulary', vocabulary);

    return vocabulary;
  }

  async sendText(userFbId: string, message: string) {
    await this.client.sendText(userFbId, message);
  }

  async saveNewMetaData(
    metaDataUser: MetaDataUsersEntity,
    resGemini: TOutputChatGemini,
  ) {
    const { userId } = metaDataUser;
    await this.prisma.metaDataUsers.update({
      where: { userId },
      data: {
        profile: resGemini.userProfileSummary,
      },
    });
  }

  async sendReplyGemini(id: string, resGemini: TOutputChatGemini) {
    await this.client.sendRawBody({
      recipient: {
        id,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: resGemini.reply,
            buttons: [
              {
                type: 'postback',
                title: 'Dịch',
                payload: 'REPLY:' + resGemini.translatedReply,
              },
            ],
          },
        },
      },
    });
  }

  async sendTip(id: string, resGemini: TOutputChatGemini) {
    await this.client.sendRawBody({
      recipient: {
        id,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: resGemini.grammarTip,
            buttons: resGemini.suggestedVocabulary.slice(0, 3).map((item) => ({
              type: 'postback',
              title: item.word,
              payload: 'ADD_TO_CART',
            })),
          },
        },
      },
    });
  }
}
