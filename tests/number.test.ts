import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";

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

  expect(() => schema.parse("num=invalid")).toThrow();
});
