import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";
import { expectFirstIssueToBe } from "./utils";

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

test("Invalid number should cause validation error", () => {
  const schema = searchParams({
    num: z.number(),
  });

  const result = schema.safeParse("num=invalid");
  expectFirstIssueToBe(result, {
    code: "invalid_type",
    path: ["num"],
    message: "Invalid input: expected number, received undefined",
  });
});

test("Number too small should cause validation error", () => {
  const schema = searchParams({
    num: z.number().min(10),
  });

  const result = schema.safeParse("num=5");
  expectFirstIssueToBe(result, {
    code: "too_small",
    path: ["num"],
    message: "Too small: expected number to be >=10",
  });
});

test("Number too big should cause validation error", () => {
  const schema = searchParams({
    num: z.number().max(100),
  });

  const result = schema.safeParse("num=200");
  expectFirstIssueToBe(result, {
    code: "too_big",
    path: ["num"],
    message: "Too big: expected number to be <=100",
  });
});

test("Number not integer should cause validation error", () => {
  const schema = searchParams({
    num: z.number().int(),
  });

  const result = schema.safeParse("num=3.14");
  expectFirstIssueToBe(result, {
    code: "invalid_type",
    path: ["num"],
    message: "Invalid input: expected int, received number",
  });
});
