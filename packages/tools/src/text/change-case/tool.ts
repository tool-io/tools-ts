import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type CaseTarget = "camel" | "constant" | "kebab" | "pascal" | "snake";

export type ChangeCaseInput = {
  readonly target: CaseTarget;
  readonly text: string;
};

export type ChangeCaseOutput = {
  readonly formatted: string;
};

export const changeCaseInputSchema = {
  additionalProperties: false,
  properties: {
    target: {
      description: "Identifier convention to produce.",
      enum: ["camel", "constant", "kebab", "pascal", "snake"],
      type: "string",
    },
    text: {
      description: "Source identifier or phrase.",
      maxLength: 2048,
      minLength: 1,
      type: "string",
    },
  },
  required: ["target", "text"],
  type: "object",
} as const;

export const changeCaseOutputSchema = {
  additionalProperties: false,
  properties: {
    formatted: {
      description: "Text converted to the target convention.",
      minLength: 1,
      type: "string",
    },
  },
  required: ["formatted"],
  type: "object",
} as const;

export const changeCaseExample = {
  input: { target: "camel", text: "parse HTTPResponse body_2" },
  output: { formatted: "parseHttpResponseBody2" },
} satisfies ToolExample<ChangeCaseInput, ChangeCaseOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const DELIMITERS = /[\s_\-.]+/g;
const LOWER_UPPER = /([a-z\u00E0-\u00FC0-9])([A-Z])/g;
const UPPER_UPPER_LOWER = /([A-Z]+)([A-Z][a-z])/g;

/** Splits on delimiters plus camel-case and acronym boundaries. */
const splitWords = (text: string): string[] =>
  text
    .replace(LOWER_UPPER, "$1 $2")
    .replace(UPPER_UPPER_LOWER, "$1 $2")
    .split(DELIMITERS)
    .filter(Boolean);

const joiners: Readonly<
  Record<Exclude<CaseTarget, never>, (words: string[]) => string>
> = {
  camel: (words) =>
    words
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(""),
  constant: (words) => words.map((word) => word.toUpperCase()).join("_"),
  kebab: (words) => words.map((word) => word.toLowerCase()).join("-"),
  pascal: (words) =>
    words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(""),
  snake: (words) => words.map((word) => word.toLowerCase()).join("_"),
};

export const isChangeCaseOutput = (
  value: unknown,
): value is ChangeCaseOutput =>
  isRecord(value) && typeof value.formatted === "string";

export const calculateChangeCase = (
  input: unknown,
): ToolResult<ChangeCaseOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "target" && field !== "text")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const target = input.target as CaseTarget | undefined;
  if (target === undefined)
    return invalidInput([
      ...issues,
      {
        code: "target_required",
        field: "target",
        message: "target is required.",
      },
    ]);
  if (!(target in joiners))
    return invalidInput([
      ...issues,
      {
        code: "target_invalid",
        field: "target",
        message: "target must be a supported case convention.",
      },
    ]);

  const rawText = input.text;
  if (rawText === undefined)
    return invalidInput([
      ...issues,
      {
        code: "text_required",
        field: "text",
        message: "text is required.",
      },
    ]);
  if (typeof rawText !== "string" || rawText.trim().length < 1)
    return invalidInput([
      ...issues,
      {
        code: "text_invalid",
        field: "text",
        message: "text must be a non-empty string.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "textCharacters",
    rawText.length,
    "text",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  if (issues.length > 0) return invalidInput(issues);

  const words = splitWords(rawText);
  if (words.length === 0)
    return invalidInput([
      {
        code: "text_invalid",
        field: "text",
        message: "text must contain at least one alphanumeric character.",
      },
    ]);
  return toolSuccess({ formatted: joiners[target](words) });
};

export const changeCaseTool = defineTool<ChangeCaseInput, ChangeCaseOutput>({
  contractVersion: 1,
  description:
    "Convert an identifier or phrase between camel, pascal, snake, kebab, and constant conventions.",
  discovery: {
    aliases: ["case-converter", "identifier-converter"],
    keywords: ["camel", "case", "kebab", "naming", "snake"],
  },
  execute: calculateChangeCase,
  execution: { kind: "pure" },
  id: "text/change-case",
  inputSchema: changeCaseInputSchema,
  outputSchema: changeCaseOutputSchema,
  ports: {
    inputs: [
      {
        description: "Source identifier or phrase.",
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
      {
        description: "Target naming convention.",
        id: "target",
        label: "Target",
        required: true,
        valueType: { format: "case-convention", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Converted text.",
        id: "formatted",
        label: "Formatted",
        valueType: { type: "string" },
      },
    ],
  },
  title: "Change Case",
});

export const runChangeCase = changeCaseTool.execute;
export default changeCaseTool;
