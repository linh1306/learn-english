import { TInputChatGemini } from './../../gemini/folws/chat.flow';
import { chat } from '@app/gemini/folws/chat.flow';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  async chatGemini(data: TInputChatGemini) {
    return await chat(data);
  }
}
