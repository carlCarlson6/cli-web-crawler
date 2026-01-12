
import z from "zod";

export const filesSchema = z.record(z.string(), z.string());
export type Files = z.infer<typeof filesSchema>;