import {
  ZodBigInt,
  ZodBoolean,
  ZodEnum,
  ZodLiteral,
  ZodNumber,
  ZodOptional,
  ZodString,
  ZodStringFormat,
  ZodTemplateLiteral,
  z,
} from "zod/v4";
import type { $ZodStringFormats } from "zod/v4/core";

type AllowedLiteral =
  | ZodLiteral<string>
  | ZodLiteral<number>
  | ZodLiteral<boolean>
  | ZodLiteral<bigint>;

type AllowedParamPrimitives =
  | ZodString
  | ZodNumber
  | ZodBigInt
  | ZodTemplateLiteral
  | AllowedLiteral
  | ZodEnum
  | ZodStringFormat<$ZodStringFormats>;

export type SearchParamsObjectValue =
  | AllowedParamPrimitives
  | ZodBoolean
  | ZodOptional<AllowedParamPrimitives>;

export type SearchParamsObject = Record<string, SearchParamsObjectValue>;

type ParseInstruction = {
  type: "string" | "number" | "boolean" | "bigint";
  optional: boolean;
};

const parseNumber = (value: string | undefined) => {
  if (value === undefined) return undefined;

  const num = parseFloat(value);

  return isNaN(num) ? undefined : num;
};

const parseBigInt = (value: string | undefined) => {
  if (value === undefined) return undefined;

  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
};

const parseBoolean = (value: string | undefined) => {
  if (value === undefined) return false;

  const isTrue = value.toLowerCase() === "true";

  return isTrue;
};

const parse = (instruction: ParseInstruction, value: string | undefined) => {
  switch (instruction.type) {
    case "string":
      return value;
    case "number":
      return parseNumber(value);
    case "boolean":
      return parseBoolean(value);
    case "bigint":
      return parseBigInt(value);
  }
};

const processPrimitive = (
  schema: AllowedParamPrimitives | ZodBoolean,
): ParseInstruction => {
  switch (schema.def.type) {
    case "string":
    case "template_literal":
    case "enum":
      return { type: "string", optional: false };
    case "number":
      return { type: "number", optional: false };
    case "boolean":
      return { type: "boolean", optional: false };
    case "bigint":
      return { type: "bigint", optional: false };

    case "literal":
      return {
        type: typeof schema.def.values[0]! as ParseInstruction["type"],
        optional: false,
      };
  }

  // @ts-expect-error: This is only executed if someone misused the interface
  console.warn(`Type "${schema?.def?.type}" is not supported by searchParams.`);
};

const processType = (schema: SearchParamsObjectValue): ParseInstruction => {
  switch (schema.def.type) {
    case "optional":
      const { type } = processPrimitive(schema.def.innerType);
      return { type, optional: true };
  }
  return processPrimitive(schema as AllowedParamPrimitives);
};

export const searchParamsObject = <Params extends SearchParamsObject>(
  paramsSchema: Params,
) => {
  const parseInstructions = Object.entries(paramsSchema).map(
    ([key, schema]) => ({
      key,
      instruction: processType(schema),
    }),
  );

  const fullSchema = z.object(paramsSchema);

  return z.preprocess((searchParamString: string | URLSearchParams) => {
    const searchParams = new URLSearchParams(searchParamString);

    const entries = parseInstructions.map(({ instruction, key }) => [
      key,
      parse(instruction, searchParams.getAll(key).pop()),
    ]);

    return Object.fromEntries(entries);
  }, fullSchema);
};
