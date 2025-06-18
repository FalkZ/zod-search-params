import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from ".";

test("Basic string parsing", () => {
  const schema = searchParams({
    name: z.string(),
  });

  const result = schema.parse("name=john");
  expect(result).toEqual({ name: "john" });
});

test("String with constraints", () => {
  const schema = searchParams({
    str: z.string().min(2).max(10),
  });

  const result = schema.parse("str=hello");
  expect(result).toEqual({ str: "hello" });
});

test("Email validation", () => {
  const schema = searchParams({
    email: z.string().email(),
  });

  const result = schema.parse("email=test@example.com");
  expect(result).toEqual({ email: "test@example.com" });
});

test("Number parsing", () => {
  const schema = searchParams({
    num: z.number(),
  });

  const result = schema.parse("num=42");
  expect(result).toEqual({ num: 42 });
});

test("Number parsing with decimals", () => {
  const schema = searchParams({
    price: z.number(),
  });

  const result = schema.parse("price=19.99");
  expect(result).toEqual({ price: 19.99 });
});

test("BigInt parsing", () => {
  const schema = searchParams({
    bigNum: z.bigint(),
  });

  const result = schema.parse("bigNum=123456789012345");
  expect(result).toEqual({ bigNum: 123456789012345n });
});

test("Boolean parsing - true", () => {
  const schema = searchParams({
    flag: z.boolean(),
  });

  const result = schema.parse("flag=true");
  expect(result).toEqual({ flag: true });
});

test("Boolean parsing - false", () => {
  const schema = searchParams({
    flag: z.boolean(),
  });

  const result = schema.parse("flag=false");
  expect(result).toEqual({ flag: false });
});

test("Boolean parsing - case insensitive", () => {
  const schema = searchParams({
    flag1: z.boolean(),
    flag2: z.boolean(),
  });

  const result = schema.parse("flag1=TRUE&flag2=False");
  expect(result).toEqual({ flag1: true, flag2: false });
});

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
    greeting: z.templateLiteral("hello-world"),
  });

  const result = schema.parse("greeting=hello-world");
  expect(result).toEqual({ greeting: "hello-world" });
});

test("Optional parameter - provided", () => {
  const schema = searchParams({
    optional: z.string().optional(),
  });

  const result = schema.parse("optional=value");
  expect(result).toEqual({ optional: "value" });
});

test("Optional parameter - not provided", () => {
  const schema = searchParams({
    optional: z.string().optional(),
  });

  const result = schema.parse("");
  expect(result).toEqual({ optional: undefined });
});

test("Optional number - provided", () => {
  const schema = searchParams({
    optNum: z.number().optional(),
  });

  const result = schema.parse("optNum=123");
  expect(result).toEqual({ optNum: 123 });
});

test("Optional number - not provided", () => {
  const schema = searchParams({
    optNum: z.number().optional(),
  });

  const result = schema.parse("");
  expect(result).toEqual({ optNum: undefined });
});

test("Multiple parameters", () => {
  const schema = searchParams({
    name: z.string(),
    age: z.number(),
    active: z.boolean(),
  });

  const result = schema.parse("name=alice&age=25&active=true");
  expect(result).toEqual({ name: "alice", age: 25, active: true });
});

test("Mixed optional and required parameters", () => {
  const schema = searchParams({
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

test("URL encoded values", () => {
  const schema = searchParams({
    message: z.string(),
  });

  const result = schema.parse("message=hello%20world");
  expect(result).toEqual({ message: "hello world" });
});

test("Empty string parameter", () => {
  const schema = searchParams({
    empty: z.string(),
  });

  const result = schema.parse("empty=");
  expect(result).toEqual({ empty: "" });
});

test("Invalid number should cause validation error", () => {
  const schema = searchParams({
    num: z.number(),
  });

  expect(() => schema.parse("num=invalid")).toThrow();
});

test("Invalid bigint should cause validation error", () => {
  const schema = searchParams({
    big: z.bigint(),
  });

  expect(() => schema.parse("big=invalid")).toThrow();
});

test("Invalid email should cause validation error", () => {
  const schema = searchParams({
    email: z.string().email(),
  });

  expect(() => schema.parse("email=invalid-email")).toThrow();
});

test("String too short should cause validation error", () => {
  const schema = searchParams({
    str: z.string().min(5),
  });

  expect(() => schema.parse("str=hi")).toThrow();
});

test("String too long should cause validation error", () => {
  const schema = searchParams({
    str: z.string().max(3),
  });

  expect(() => schema.parse("str=toolong")).toThrow();
});

test("Wrong literal value should cause validation error", () => {
  const schema = searchParams({
    type: z.literal("admin"),
  });

  expect(() => schema.parse("type=user")).toThrow();
});

test("Missing required parameter should cause validation error", () => {
  const schema = searchParams({
    required: z.string(),
  });

  expect(() => schema.parse("")).toThrow();
});

test("Complex schema with all types", () => {
  const schema = searchParams({
    str: z.string(),
    str2: z.string().min(2).max(10),
    str3: z.string().email(),
    lit: z.literal(["admin", ""]),
    num: z.number(),
    optNum: z.number().optional(),
    bigint: z.bigint(),
    email: z.email(),
    date: z.iso.date(),
    template: z.templateLiteral(["hi there"]),
    bool: z.boolean(),
    template: z.templateLiteral(["prefix-suffix"]),
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
  const schema = searchParams({
    name: z.string(),
  });

  const result = schema.parse("name=first&name=second");
  expect(result).toEqual({ name: "second" });
});

test("Boolean missing value defaults to false", () => {
  const schema = searchParams({
    flag: z.boolean(),
  });

  const result = schema.parse("flag");
  expect(result).toEqual({ flag: false });
});

test("Number zero parsing", () => {
  const schema = searchParams({
    zero: z.number(),
  });

  const result = schema.parse("zero=0");
  expect(result).toEqual({ zero: 0 });
});

test("Negative number parsing", () => {
  const schema = searchParams({
    negative: z.number(),
  });

  const result = schema.parse("negative=-42");
  expect(result).toEqual({ negative: -42 });
});

test("BigInt zero parsing", () => {
  const schema = searchParams({
    zero: z.bigint(),
  });

  const result = schema.parse("zero=0");
  expect(result).toEqual({ zero: 0n });
});

test("Negative BigInt parsing", () => {
  const schema = searchParams({
    negative: z.bigint(),
  });

  const result = schema.parse("negative=-999");
  expect(result).toEqual({ negative: -999n });
});
