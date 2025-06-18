import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParams } from "..";
import { expectFirstIssueToBe } from "./utils";

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

  const result = schema.safeParse("big=invalid");
  expectFirstIssueToBe(result, {
    code: "invalid_type",
    path: ["big"],
    message: "Invalid input: expected bigint, received undefined",
  });
});

test("BigInt too small should cause validation error", () => {
  const schema = searchParams({
    big: z.bigint().min(100n),
  });

  const result = schema.safeParse("big=50");
  expectFirstIssueToBe(result, {
    code: "too_small",
    path: ["big"],
    message: "Too small: expected bigint to be >=100",
  });
});

test("BigInt too big should cause validation error", () => {
  const schema = searchParams({
    big: z.bigint().max(1000n),
  });

  const result = schema.safeParse("big=2000");
  expectFirstIssueToBe(result, {
    code: "too_big",
    path: ["big"],
    message: "Too big: expected bigint to be <=1000",
  });
});
