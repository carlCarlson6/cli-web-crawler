import "dotenv/config";
import { requireAuth } from '@clerk/express';
import type { Response, Request, Express } from 'express';
import { getCurrentUser } from "./auth";
import { saveCliRequestPayloadSchema as schema } from "cli-contracts";

export const mapSaveCliEndpoint = (app: Express) => app.post(
  '/api/save',
  requireAuth(),
  (_, __, next) => {
    console.log("POST /api/save");
    next();
  },
  handler
);

const handler = async (req: Request, res: Response) => {
  var parseResult = await schema.safeParseAsync(req.body);
  if (!parseResult.success) return res.status(400);

  const user = await getCurrentUser(req);

  console.log("pending to store cli")

  return res.status(201);
}