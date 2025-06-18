import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject } from "../src";

test("Boolean parsing - true", () => {
  const schema = searchParamsObject({
    flag: z.boolean(),
  });

  const result = schema.parse("flag=true");
  expect(result).toEqual({ flag: true });
});

test("Boolean parsing - false", () => {
  const schema = searchParamsObject({
    flag: z.boolean(),
  });

  const result = schema.parse("flag=false");
  expect(result).toEqual({ flag: false });
});

test("Boolean parsing - case insensitive", () => {
  const schema = searchParamsObject({
    flag1: z.boolean(),
    flag2: z.boolean(),
  });

  const result = schema.parse("flag1=TRUE&flag2=False");
  expect(result).toEqual({ flag1: true, flag2: false });
});

test("Boolean missing value defaults to false", () => {
  const schema = searchParamsObject({
    flag: z.boolean(),
  });

  const result = schema.parse("flag");
  expect(result).toEqual({ flag: false });
});
