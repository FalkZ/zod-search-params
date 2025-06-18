import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject } from "..";
import { expectIssuesToBe } from "./utils";

test("Multiple parameters", () => {
  const schema = searchParamsObject({
    name: z.string(),
    age: z.number(),
    active: z.boolean(),
  });

  const result = schema.parse("name=alice&age=25&active=true");
  expect(result).toEqual({ name: "alice", age: 25, active: true });
});

test("Complex schema with all types", () => {
  const schema = searchParamsObject({
    str: z.string(),
    str2: z.string().min(2).max(10),
    str3: z.string().email(),
    lit: z.literal(["admin", ""]),
    num: z.number(),
    optNum: z.number().optional(),
    bigint: z.bigint(),
    email: z.email(),
    date: z.iso.date(),
    template: z.templateLiteral(["prefix-suffix"]),
    bool: z.boolean(),
  });

  const queryString =
    "str=hello&str2=test&str3=user@example.com&lit=admin&num=42&bigint=999&bool=true&template=prefix-suffix&email=user@example.com&date=2023-01-01";
  const result = schema.parse(queryString);

  expect(result).toEqual({
    str: "hello",
    str2: "test",
    str3: "user@example.com",
    lit: "admin",
    num: 42,
    optNum: undefined,
    bigint: 999n,
    bool: true,
    template: "prefix-suffix",
    date: "2023-01-01",
    email: "user@example.com",
  });
});

test("Duplicate parameters - uses last value", () => {
  const schema = searchParamsObject({
    name: z.string(),
  });

  const result = schema.parse("name=first&name=second");
  expect(result).toEqual({ name: "second" });
});

test("Multiple validation errors", () => {
  const schema = searchParamsObject({
    name: z.string().min(5),
    age: z.number().min(18),
    email: z.string().email(),
    type: z.literal("admin"),
  });

  const result = schema.safeParse("name=hi&age=15&email=invalid&type=user");
  expectIssuesToBe(result, [
    {
      code: "too_small",
      path: ["name"],
      message: "Too small: expected string to have >=5 characters",
    },
    {
      code: "too_small",
      path: ["age"],
      message: "Too small: expected number to be >=18",
    },
    {
      code: "invalid_format",
      path: ["email"],
      message: "Invalid email address",
    },
    {
      code: "invalid_value",
      path: ["type"],
      message: 'Invalid input: expected "admin"',
    },
  ]);
});
