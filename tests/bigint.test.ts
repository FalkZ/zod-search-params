import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";

test("BigInt parsing", () => {
  const schema = searchParams({
    bigNum: z.bigint(),
  });

  const result = schema.parse("bigNum=123456789012345");
  expect(result).toEqual({ bigNum: 123456789012345n });
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

test("Invalid bigint should cause validation error", () => {
  const schema = searchParams({
    big: z.bigint(),
  });

  expect(() => schema.parse("big=invalid")).toThrow();
});
