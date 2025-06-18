import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject, toSearchParams } from "../src/index";

test("Quick Start - Parse example", () => {
  const schema = searchParamsObject({
    query: z.string(),
    page: z.number(),
    limit: z.number().optional(),
    active: z.boolean(),
  });

  const params = schema.parse("?query=hello&page=1&active=true");

  expect(params).toEqual({
    query: "hello",
    page: 1,
    limit: undefined,
    active: true,
  });
});

test("Quick Start - Serialize example", () => {
  const urlParams = toSearchParams({ query: "world", page: 2, active: false });

  expect(urlParams).toBeInstanceOf(URLSearchParams);
  expect(urlParams.get("query")).toBe("world");
  expect(urlParams.get("page")).toBe("2");
  // Important: toSearchParams removes false values completely
  expect(urlParams.has("active")).toBe(false);
  expect(urlParams.has("limit")).toBe(false);
});

test("Creating a Schema - Basic usage", () => {
  const schema = searchParamsObject({
    name: z.string(),
    age: z.number(),
    active: z.boolean().optional(),
  });

  type InferredType = z.infer<typeof schema>;

  // Test parsing from string
  const typedObject1 = schema.parse("name=john&age=25&active=true");
  expect(typedObject1).toEqual({
    name: "john",
    age: 25,
    active: true,
  });

  // Test parsing from URLSearchParams
  const typedObject2 = schema.parse(new URLSearchParams("name=john&age=25"));
  expect(typedObject2).toEqual({
    name: "john",
    age: 25,
    // Important: Missing boolean parameters default to false, even when optional
    active: false,
  });

  // Test type inference
  const testInferredType: InferredType = {
    name: "test",
    age: 30,
    active: true,
  };
  expect(testInferredType.name).toBe("test");
  expect(testInferredType.age).toBe(30);
  expect(testInferredType.active).toBe(true);
});

test("Serializing to URLSearchParams - Create new params", () => {
  const params = toSearchParams({
    query: "hello",
    page: 1,
    active: true,
    disabled: false,
    empty: undefined,
  });

  expect(params).toBeInstanceOf(URLSearchParams);
  expect(params.get("query")).toBe("hello");
  expect(params.get("page")).toBe("1");
  expect(params.get("active")).toBe("true");
  // Important: toSearchParams behavior - false and undefined values are removed
  expect(params.has("disabled")).toBe(false); // false values are removed
  expect(params.has("empty")).toBe(false); // undefined values are removed
});

test("Serializing to URLSearchParams - Update existing params", () => {
  // Simulate window.location.search
  const existingSearch = "?existing=value&page=5";

  const updatedParams = toSearchParams(
    {
      query: "hello",
      page: 1,
      active: true,
      disabled: false,
      empty: undefined,
    },
    existingSearch,
  );

  expect(updatedParams).toBeInstanceOf(URLSearchParams);
  expect(updatedParams.get("query")).toBe("hello");
  expect(updatedParams.get("page")).toBe("1"); // Should be updated from existing
  expect(updatedParams.get("active")).toBe("true");
  expect(updatedParams.has("disabled")).toBe(false); // false values are removed
  expect(updatedParams.has("empty")).toBe(false); // undefined values are removed
  expect(updatedParams.get("existing")).toBe("value"); // Preserves existing values not being updated
});
