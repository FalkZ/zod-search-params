import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject } from "../src";
import { expectFirstIssueToBe } from "./utils";

test("Basic string parsing", () => {
  const schema = searchParamsObject({
    name: z.string(),
  });

  const result = schema.parse("name=john");
  expect(result).toEqual({ name: "john" });
});

test("String with constraints", () => {
  const schema = searchParamsObject({
    str: z.string().min(2).max(10),
  });

  const result = schema.parse("str=hello");
  expect(result).toEqual({ str: "hello" });
});

test("Email validation", () => {
  const schema = searchParamsObject({
    email: z.string().email(),
  });

  const result = schema.parse("email=test@example.com");
  expect(result).toEqual({ email: "test@example.com" });
});

test("URL encoded values", () => {
  const schema = searchParamsObject({
    message: z.string(),
  });

  const result = schema.parse("message=hello%20world");
  expect(result).toEqual({ message: "hello world" });
});

test("Empty string parameter", () => {
  const schema = searchParamsObject({
    empty: z.string(),
  });

  const result = schema.parse("empty=");
  expect(result).toEqual({ empty: "" });
});

test("String too short should cause validation error", () => {
  const schema = searchParamsObject({
    str: z.string().min(5),
  });

  const result = schema.safeParse("str=hi");
  expectFirstIssueToBe(result, {
    code: "too_small",
    path: ["str"],
    message: "Too small: expected string to have >=5 characters",
  });
});

test("String too long should cause validation error", () => {
  const schema = searchParamsObject({
    str: z.string().max(3),
  });

  const result = schema.safeParse("str=toolong");
  expectFirstIssueToBe(result, {
    code: "too_big",
    path: ["str"],
    message: "Too big: expected string to have <=3 characters",
  });
});

test("Invalid email should cause validation error", () => {
  const schema = searchParamsObject({
    email: z.string().email(),
  });

  const result = schema.safeParse("email=invalid-email");
  expectFirstIssueToBe(result, {
    code: "invalid_format",
    path: ["email"],
    message: "Invalid email address",
  });
});
