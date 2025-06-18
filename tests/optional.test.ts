import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject } from "..";
import { expectFirstIssueToBe } from "./utils";

test("Optional parameter - provided", () => {
  const schema = searchParamsObject({
    optional: z.string().optional(),
  });

  const result = schema.parse("optional=value");
  expect(result).toEqual({ optional: "value" });
});

test("Optional parameter - not provided", () => {
  const schema = searchParamsObject({
    optional: z.string().optional(),
  });

  const result = schema.parse("");
  expect(result).toEqual({ optional: undefined });
});

test("Optional number - provided", () => {
  const schema = searchParamsObject({
    optNum: z.number().optional(),
  });

  const result = schema.parse("optNum=123");
  expect(result).toEqual({ optNum: 123 });
});

test("Optional number - not provided", () => {
  const schema = searchParamsObject({
    optNum: z.number().optional(),
  });

  const result = schema.parse("");
  expect(result).toEqual({ optNum: undefined });
});

test("Mixed optional and required parameters", () => {
  const schema = searchParamsObject({
    required: z.string(),
    optional: z.string().optional(),
    requiredNum: z.number(),
    optionalNum: z.number().optional(),
  });

  const result = schema.parse("required=test&requiredNum=42");
  expect(result).toEqual({
    required: "test",
    optional: undefined,
    requiredNum: 42,
    optionalNum: undefined,
  });
});

test("Missing required parameter should cause validation error", () => {
  const schema = searchParamsObject({
    required: z.string(),
  });

  const result = schema.safeParse("");
  expectFirstIssueToBe(result, {
    code: "invalid_type",
    path: ["required"],
    message: "Invalid input: expected string, received undefined",
  });
});
