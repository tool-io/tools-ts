import { defineTool, type ToolDefinition } from "../core/definition.js";
import type { ToolExample } from "../core/example.js";
import { invalidInput, toolSuccess } from "../core/result.js";

export type IdentifierGeneratorInput = { readonly dataDigits: string };
export type IdentifierGeneratorOutput = {
  readonly checkDigit: string;
  readonly identifier: string;
};
export type IdentifierValidatorInput = { readonly identifier: string };
export type IdentifierValidatorOutput = {
  readonly normalized: string;
  readonly type: string;
  readonly valid: boolean;
};

export const stripIdentifierSeparators = (value: string): string =>
  value.replace(/[\s-]+/gu, "").toUpperCase();

export const gs1CheckDigit = (dataDigits: string): string => {
  let sum = 0;
  for (
    let index = dataDigits.length - 1, position = 1;
    index >= 0;
    index -= 1, position += 1
  )
    sum += Number(dataDigits[index]) * (position % 2 === 1 ? 3 : 1);
  return String((10 - (sum % 10)) % 10);
};

export const isbn10CheckDigit = (dataDigits: string): string => {
  const sum = Array.from(dataDigits, Number).reduce(
    (total, digit, index) => total + digit * (10 - index),
    0,
  );
  const check = (11 - (sum % 11)) % 11;
  return check === 10 ? "X" : String(check);
};

export const issnCheckDigit = (dataDigits: string): string => {
  const sum = Array.from(dataDigits, Number).reduce(
    (total, digit, index) => total + digit * (8 - index),
    0,
  );
  const check = (11 - (sum % 11)) % 11;
  return check === 10 ? "X" : String(check);
};

type GeneratorConfig = {
  readonly aliases?: readonly string[];
  readonly build: (dataDigits: string) => string;
  readonly dataLength: number;
  readonly description: string;
  readonly exampleData: string;
  readonly id: `generate/${string}`;
  readonly keywords: readonly string[];
  readonly title: string;
  readonly validateData?: (dataDigits: string) => string | null;
};

const calculateGeneratedIdentifier = (
  input: unknown,
  config: GeneratorConfig,
) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).dataDigits !== "string"
  )
    return invalidInput([
      {
        code: "data_digits_required",
        field: "dataDigits",
        message: "Data digits are required.",
      },
    ]);
  if (Object.keys(input).some((field) => field !== "dataDigits"))
    return invalidInput([
      {
        code: "unknown_field",
        field: "",
        message: "Only dataDigits is supported.",
      },
    ]);
  const dataDigits = stripIdentifierSeparators(
    (input as IdentifierGeneratorInput).dataDigits,
  );
  if (!/^\d+$/u.test(dataDigits) || dataDigits.length !== config.dataLength)
    return invalidInput([
      {
        code: "data_digits_invalid",
        field: "dataDigits",
        message: `Enter exactly ${config.dataLength} decimal data digits without a check digit.`,
      },
    ]);
  const detail = config.validateData?.(dataDigits);
  if (detail)
    return invalidInput([
      {
        code: "identifier_prefix_invalid",
        field: "dataDigits",
        message: detail,
      },
    ]);
  const identifier = config.build(dataDigits);
  return toolSuccess({
    checkDigit: identifier.at(-1)!,
    identifier,
  });
};

export const createIdentifierGenerator = (
  config: GeneratorConfig,
): ToolDefinition<IdentifierGeneratorInput, IdentifierGeneratorOutput> =>
  defineTool<IdentifierGeneratorInput, IdentifierGeneratorOutput>({
    contractVersion: 1,
    description: config.description,
    discovery: {
      aliases: config.aliases ?? [],
      collections: ["generate", "identifiers"],
      keywords: ["check digit", "identifier", ...config.keywords],
    },
    execute: (input) => calculateGeneratedIdentifier(input, config),
    execution: { kind: "pure" },
    id: config.id,
    inputSchema: {
      additionalProperties: false,
      properties: {
        dataDigits: {
          maxLength: config.dataLength,
          minLength: config.dataLength,
          pattern: `^\\d{${config.dataLength}}$`,
          type: "string",
        },
      },
      required: ["dataDigits"],
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: {
        checkDigit: { minLength: 1, type: "string" },
        identifier: { minLength: 1, type: "string" },
      },
      required: ["checkDigit", "identifier"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "dataDigits",
          label: `Data digits (${config.dataLength})`,
          required: true,
          valueType: { format: "identifier-data-digits", type: "string" },
        },
      ],
      outputs: [
        {
          id: "identifier",
          label: config.title.replace(/ Generator$/u, ""),
          valueType: { format: "identifier", type: "string" },
        },
        {
          id: "checkDigit",
          label: "Check digit",
          valueType: { format: "check-digit", type: "string" },
        },
      ],
    },
    title: config.title,
  });

export const createIdentifierGeneratorModule = (config: GeneratorConfig) => {
  const tool = createIdentifierGenerator(config);
  const result = tool.execute({ dataDigits: config.exampleData });
  if (!result.ok) throw new Error(`${config.id} example is invalid.`);
  const example: ToolExample<
    IdentifierGeneratorInput,
    IdentifierGeneratorOutput
  > = {
    input: { dataDigits: config.exampleData },
    output: result.output,
  };
  return { example, run: tool.execute, tool } as const;
};

type ValidatorConfig = {
  readonly aliases?: readonly string[];
  readonly description: string;
  readonly exampleIdentifier: string;
  readonly id: `validate/${string}`;
  readonly keywords: readonly string[];
  readonly normalize?: (identifier: string) => string;
  readonly title: string;
  readonly type: string;
  readonly validate: (identifier: string) => boolean;
};

const calculateValidatedIdentifier = (
  input: unknown,
  config: ValidatorConfig,
) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).identifier !== "string"
  )
    return invalidInput([
      {
        code: "identifier_required",
        field: "identifier",
        message: "Identifier text is required.",
      },
    ]);
  if (Object.keys(input).some((field) => field !== "identifier"))
    return invalidInput([
      {
        code: "unknown_field",
        field: "",
        message: "Only identifier is supported.",
      },
    ]);
  const raw = (input as IdentifierValidatorInput).identifier;
  if (raw.length > 64)
    return invalidInput([
      {
        code: "identifier_too_long",
        field: "identifier",
        message: "Identifier text must contain at most 64 characters.",
      },
    ]);
  const normalized = (config.normalize ?? stripIdentifierSeparators)(raw);
  return toolSuccess({
    normalized,
    type: config.type,
    valid: config.validate(normalized),
  });
};

export const createIdentifierValidator = (
  config: ValidatorConfig,
): ToolDefinition<IdentifierValidatorInput, IdentifierValidatorOutput> =>
  defineTool<IdentifierValidatorInput, IdentifierValidatorOutput>({
    contractVersion: 1,
    description: config.description,
    discovery: {
      aliases: config.aliases ?? [],
      collections: ["identifiers", "validate"],
      keywords: ["check digit", "identifier", ...config.keywords],
    },
    execute: (input) => calculateValidatedIdentifier(input, config),
    execution: { kind: "pure" },
    id: config.id,
    inputSchema: {
      additionalProperties: false,
      properties: { identifier: { maxLength: 64, type: "string" } },
      required: ["identifier"],
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: {
        normalized: { type: "string" },
        type: { type: "string" },
        valid: { type: "boolean" },
      },
      required: ["normalized", "type", "valid"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: config.type,
          required: true,
          valueType: { format: "identifier", type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "normalized",
          label: "Normalized identifier",
          valueType: { format: "identifier", type: "string" },
        },
        { id: "type", label: "Type", valueType: { type: "string" } },
      ],
    },
    title: config.title,
  });

export const createIdentifierValidatorModule = (config: ValidatorConfig) => {
  const tool = createIdentifierValidator(config);
  const result = tool.execute({ identifier: config.exampleIdentifier });
  if (!result.ok) throw new Error(`${config.id} example is invalid.`);
  const example: ToolExample<
    IdentifierValidatorInput,
    IdentifierValidatorOutput
  > = {
    input: { identifier: config.exampleIdentifier },
    output: result.output,
  };
  return { example, run: tool.execute, tool } as const;
};

export const validGs1 = (identifier: string, length: number): boolean =>
  /^\d+$/u.test(identifier) &&
  identifier.length === length &&
  gs1CheckDigit(identifier.slice(0, -1)) === identifier.at(-1);

export type { GeneratorConfig, ValidatorConfig };
