import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export default new PrismaClient().$extends(withAccelerate());
