import { describe, expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject, toSearchParams } from "../src";

describe("Roundtrip tests: object -> URLSearchParams -> object", () => {
  test("Basic string roundtrip", () => {
    const schema = searchParamsObject({
      name: z.string(),
      message: z.string(),
    });

    const original = {
      name: "john",
      message: "hello world",
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Number roundtrip", () => {
    const schema = searchParamsObject({
      age: z.number(),
      price: z.number(),
      negative: z.number(),
      decimal: z.number(),
    });

    const original = {
      age: 25,
      price: 99,
      negative: -10,
      decimal: 3.14,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Boolean roundtrip", () => {
    const schema = searchParamsObject({
      isActive: z.boolean(),
      isEnabled: z.boolean(),
      isDisabled: z.boolean(),
    });

    const original = {
      isActive: true,
      isEnabled: true,
      isDisabled: false, // This will be removed by toSearchParams
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("BigInt roundtrip", () => {
    const schema = searchParamsObject({
      bigNum: z.bigint(),
      hugeBigInt: z.bigint(),
    });

    const original = {
      bigNum: 123n,
      hugeBigInt: 9007199254740991n,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Optional parameters roundtrip - with values", () => {
    const schema = searchParamsObject({
      required: z.string(),
      optionalString: z.string().optional(),
      optionalNumber: z.number().optional(),
    });

    const original = {
      required: "test",
      optionalString: "optional",
      optionalNumber: 42,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Optional parameters roundtrip - with undefined values", () => {
    const schema = searchParamsObject({
      required: z.string(),
      optionalString: z.string().optional(),
      optionalNumber: z.number().optional(),
    });

    const original = {
      required: "test",
      optionalString: undefined,
      optionalNumber: undefined,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Mixed data types roundtrip", () => {
    const schema = searchParamsObject({
      name: z.string(),
      age: z.number(),
      isActive: z.boolean(),
      balance: z.bigint(),
      email: z.string().optional(),
      score: z.number().optional(),
    });

    const original = {
      name: "Alice",
      age: 30,
      isActive: true,
      balance: 1000n,
      email: "alice@example.com",
      score: 95,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Literal values roundtrip", () => {
    const schema = searchParamsObject({
      status: z.literal("active"),
      count: z.literal(5),
      flag: z.literal(true),
    });

    const original = {
      status: "active" as const,
      count: 5 as const,
      flag: true as const, // This will be converted to string "true" and back
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Null values are filtered out", () => {
    const schema = searchParamsObject({
      name: z.string(),
      optional: z.string().optional(),
    });

    const original = {
      name: "test",
      optional: null, // Will be filtered out
    };

    const expected = {
      name: "test",
      optional: undefined, // Missing from search params = undefined
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(expected);
  });

  test("Complex roundtrip with edge cases", () => {
    const schema = searchParamsObject({
      emptyString: z.string(),
      zero: z.number(),
      zeroBigInt: z.bigint(),
      falseBoolean: z.boolean(),
      optionalPresent: z.string().optional(),
      optionalMissing: z.string().optional(),
    });

    const original = {
      emptyString: "",
      zero: 0,
      zeroBigInt: 0n,
      falseBoolean: false, // Will be filtered out
      optionalPresent: "present",
      optionalMissing: undefined, // Will be filtered out
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("URL encoding roundtrip", () => {
    const schema = searchParamsObject({
      message: z.string(),
      special: z.string(),
    });

    const original = {
      message: "hello world & special chars!",
      special: "100% great + awesome = true",
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Roundtrip with initial search params", () => {
    const schema = searchParamsObject({
      name: z.string(),
      age: z.number(),
      existing: z.string().optional(),
    });

    const initial = new URLSearchParams("existing=initial&name=old");
    const update = {
      name: "new",
      age: 25,
      existing: undefined, // Should remove the existing param
    };

    const searchParams = toSearchParams(update, initial);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(update);
  });

  test("Template literal roundtrip", () => {
    const schema = searchParamsObject({
      version: z.string(), // Template literals are treated as strings
    });

    const original = {
      version: "v1.2.3",
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Large dataset roundtrip", () => {
    const schema = searchParamsObject({
      str1: z.string(),
      str2: z.string(),
      str3: z.string(),
      num1: z.number(),
      num2: z.number(),
      num3: z.number(),
      bool1: z.boolean(),
      bool2: z.boolean(),
      big1: z.bigint(),
      big2: z.bigint(),
      opt1: z.string().optional(),
      opt2: z.number().optional(),
    });

    const original = {
      str1: "first",
      str2: "second",
      str3: "third",
      num1: 1,
      num2: 2,
      num3: 3,
      bool1: true,
      bool2: false, // Will be filtered out
      big1: 100n,
      big2: 200n,
      opt1: "optional",
      opt2: undefined, // Will be filtered out
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Verify URLSearchParams format is readable", () => {
    const original = {
      name: "John Doe",
      age: 30,
      isActive: true,
      balance: 1000n,
      note: undefined,
    };

    const searchParams = toSearchParams(original);
    const searchString = searchParams.toString();

    // Verify the search params string is properly formatted
    expect(searchString).toContain("name=John+Doe");
    expect(searchString).toContain("age=30");
    expect(searchString).toContain("isActive=true");
    expect(searchString).toContain("balance=1000");
    expect(searchString).not.toContain("note=");
  });

  test("Zero and falsy values handling", () => {
    const schema = searchParamsObject({
      count: z.number(),
      balance: z.bigint(),
      active: z.boolean(),
      name: z.string(),
      optionalCount: z.number().optional(),
    });

    const original = {
      count: 0,
      balance: 0n,
      active: false, // Will be filtered out
      name: "",
      optionalCount: 0,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Special characters and Unicode roundtrip", () => {
    const schema = searchParamsObject({
      emoji: z.string(),
      chinese: z.string(),
      special: z.string(),
      symbols: z.string(),
    });

    const original = {
      emoji: "🚀💻📊",
      chinese: "你好世界",
      special: "café résumé naïve",
      symbols: "!@#$%^&*()[]{}|;':\",./<>?",
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Very large numbers and edge cases", () => {
    const schema = searchParamsObject({
      maxSafeInt: z.number(),
      minSafeInt: z.number(),
      veryLargeBigInt: z.bigint(),
      negativeBigInt: z.bigint(),
      float: z.number(),
    });

    const original = {
      maxSafeInt: Number.MAX_SAFE_INTEGER,
      minSafeInt: Number.MIN_SAFE_INTEGER,
      veryLargeBigInt: BigInt("12345678901234567890"),
      negativeBigInt: BigInt("-98765432109876543210"),
      float: 3.141592653589793,
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });

  test("Empty object roundtrip", () => {
    const schema = searchParamsObject({});
    const original = {};

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
    expect(searchParams.toString()).toBe("");
  });

  test("All values undefined/null roundtrip", () => {
    const schema = searchParamsObject({
      opt1: z.string().optional(),
      opt2: z.number().optional(),
      opt3: z.boolean(),
    });

    const original = {
      opt1: undefined,
      opt2: null,
      opt3: undefined,
    };

    const expected = {
      opt1: undefined,
      opt2: undefined,
      opt3: false, // Optional boolean still returns false when missing
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(expected);
    expect(searchParams.toString()).toBe("");
  });

  test("Boolean edge cases", () => {
    const schema = searchParamsObject({
      trueValue: z.boolean(),
      falseValue: z.boolean(),
      optionalTrue: z.boolean(),
      optionalFalse: z.boolean(),
    });

    const original = {
      trueValue: true,
      falseValue: false, // Will be filtered out
      optionalTrue: true,
      optionalFalse: false, // Will be filtered out
    };

    const searchParams = toSearchParams(original);
    const parsed = schema.parse(searchParams.toString());

    expect(parsed).toEqual(original);
  });
});
