import type { TPayloadToken } from "@app/redis";
import "fastify";
import { PayloadJwtDto } from "./payload-jwt.dto";

declare module "fastify" {
  interface FastifyRequest {
    user?: PayloadJwtDto;
  }
}

declare module "http" {
  interface IncomingMessage {
    user?: PayloadJwtDto;
  }
}
