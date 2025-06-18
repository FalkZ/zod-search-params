import { expect } from "bun:test";
import type z from "zod/v4";
import type { $ZodIssue } from "zod/v4/core";

export type RelevantIssuePart = {
  code: $ZodIssue["code"];
  path: $ZodIssue["path"];
  message: $ZodIssue["message"];
};

export const expectFirstIssueToBe = (
  result: z.ZodSafeParseResult<any>,
  relevant: RelevantIssuePart,
) => {
  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.error.issues).toHaveLength(1);
    expect(result.error.issues[0].code).toBe(relevant.code);
    expect(result.error.issues[0].message).toBe(relevant.message);
    expect(result.error.issues[0].path).toEqual(relevant.path);
  }
};

export const expectIssueToBe = (
  result: z.ZodSafeParseResult<any>,
  index: number,
  { code, path, message }: RelevantIssuePart,
) => {
  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.error.issues[index].code).toBe(code);
    expect(result.error.issues[index].message).toBe(message);
    expect(result.error.issues[index].path).toEqual(path);
  }
};

export const expectIssuesToBe = (
  result: z.ZodSafeParseResult<any>,
  issues: RelevantIssuePart[],
) => {
  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.error.issues).toHaveLength(issues.length);
    issues.forEach((issue, index) => {
      expect(result.error.issues[index].code).toBe(issue.code);
      expect(result.error.issues[index].message).toBe(issue.message);
      expect(result.error.issues[index].path).toEqual(issue.path);
    });
  }
};
