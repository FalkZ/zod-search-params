import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";
import { expectFirstIssueToBe } from "./utils";

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

  const result = schema.safeParse("type=user");
  expectFirstIssueToBe(result, {
    code: "invalid_value",
    path: ["type"],
    message: 'Invalid input: expected "admin"',
  });
});

test("Wrong literal number should cause validation error", () => {
  const schema = searchParams({
    version: z.literal(1),
  });

  const result = schema.safeParse("version=2");
  expectFirstIssueToBe(result, {
    code: "invalid_value",
    path: ["version"],
    message: "Invalid input: expected 1",
  });
});

test("Invalid template literal should cause validation error", () => {
  const schema = searchParams({
    greeting: z.templateLiteral(["hello-", z.number(), "-world"]),
  });

  const result = schema.safeParse("greeting=hello-abc-world");
  expectFirstIssueToBe(result, {
    code: "invalid_format",
    path: ["greeting"],
    message: "Invalid input",
  });
});
