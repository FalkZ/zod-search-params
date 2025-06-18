import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";

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
