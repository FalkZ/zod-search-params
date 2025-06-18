import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject } from "../src";

test("Enum string parsing", () => {
  const schema = searchParamsObject({
    type: z.enum(["admin", "user"]),
  });

  const result = schema.parse("type=user");
  expect(result).toEqual({ type: "user" });
});
