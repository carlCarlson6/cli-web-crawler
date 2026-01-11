import z from "zod";
import { filesSchema } from "~/bin/files";
import { gameSchema } from "~/game";

export const saveCliRequestPayloadSchema = z.object({
  game:     gameSchema,
  files:    filesSchema,
  fileName: z.string().nonempty(),
  date:     z.string().datetime(),
});

export type SaveCliRequestPayload = z.infer<typeof saveCliRequestPayloadSchema>;