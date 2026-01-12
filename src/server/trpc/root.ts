import { postRouter } from "~/server/trpc/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/trpc";
import { saveCliMutation } from "../saveCliStatus";

export const appRouter = createTRPCRouter({
  post: postRouter,
  saveCli: saveCliMutation,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
