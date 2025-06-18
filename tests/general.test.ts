import { expect, test } from "bun:test";
import z from "zod/v4";
import { searchParamsObject } from "../src";

test("Allow ? at the beginning", () => {
  const schema = searchParamsObject({
    name: z.string(),
  });

  const result = schema.parse("?name=john");
  expect(result).toEqual({ name: "john" });
});

test("Allow URLSearchParams as input", () => {
  const schema = searchParamsObject({
    name: z.string(),
  });

  const urlSearchParams = new URLSearchParams("name=john");
  const result = schema.parse(urlSearchParams);
  expect(result).toEqual({ name: "john" });
});

test("Last param wins", () => {
  const schema = searchParamsObject({
    name: z.string(),
  });

  const result = schema.parse("name=john&name=jane");
  expect(result).toEqual({ name: "jane" });
});
