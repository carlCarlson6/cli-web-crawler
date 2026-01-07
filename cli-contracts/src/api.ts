import z from "zod";
import { gameSchema } from "./game";
import { filesSchema } from "./files";

export const saveCliRequestPayloadSchema = z.object({
  game:     gameSchema,
  files:    filesSchema,
  fileName: z.string().nonempty(),
  date:     z.iso.datetime(),
});

export type SaveCliRequestPayload = z.infer<typeof saveCliRequestPayloadSchema>;