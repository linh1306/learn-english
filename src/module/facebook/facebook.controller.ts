import { Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import CONFIG from '@app/common/config/index.config';
import { FastifyRequest } from 'fastify';

@Controller('webhook')
export class FacebookController {
  constructor(private readonly fbService: FacebookService) {}

  @Get()
  verify(@Req() req) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === CONFIG.tokenFacebook.accessToken) {
      return challenge;
    } else {
      throw new HttpException('Forbidden', 403);
    }
  }

  @Post()
  async handle(@Req() req) {
    const body = req.body;
    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const event of entry.messaging) {
          const senderId = event.sender.id;
          if (event.message?.text) {
            const metadataUsers = await this.fbService.checkLogin(senderId);
            if (!metadataUsers) {
              await this.fbService.sendText(
                senderId,
                'Bạn chưa đăng ký tài khoản',
              );
              return;
            }
            await this.fbService.chat(
              senderId,
              event.message?.text,
              metadataUsers,
            );
          } else if (event.postback?.payload) {
            await this.fbService.sendText(senderId, event.postback?.payload);
          }
        }
      }
    }
  }
}
