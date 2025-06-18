import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";

test("Literal string parsing", () => {
  const schema = searchParams({
    type: z.literal("admin"),
  });

  const result = schema.parse("type=admin");
  expect(result).toEqual({ type: "admin" });
});

test("Literal number parsing", () => {
  const schema = searchParams({
    version: z.literal(1),
  });

  const result = schema.parse("version=1");
  expect(result).toEqual({ version: 1 });
});

test("Template literal parsing", () => {
  const schema = searchParams({
    greeting: z.templateLiteral(["hello-", z.number(), "-world"]),
  });

  const result = schema.parse("greeting=hello-123-world");
  expect(result).toEqual({ greeting: "hello-123-world" });
});

test("Wrong literal value should cause validation error", () => {
  const schema = searchParams({
    type: z.literal("admin"),
  });

  expect(() => schema.parse("type=user")).toThrow();
});
