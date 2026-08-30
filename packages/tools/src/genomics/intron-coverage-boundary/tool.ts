import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly upstreamExonDepth: number;
  readonly intronDepth: number;
  readonly downstreamExonDepth: number;
  readonly minimumIntronExonRatio: number;
}>;
export type Output = Readonly<{
  readonly intronExonRatio: number;
  readonly leftDropFraction: number;
  readonly rightRiseFraction: number;
  readonly retentionCandidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const sum = input.upstreamExonDepth + input.downstreamExonDepth;
  const flankMean = Number.isFinite(sum) ? sum / 2 : input.upstreamExonDepth / 2 + input.downstreamExonDepth / 2;
  const scale = Math.max(input.upstreamExonDepth, input.downstreamExonDepth);
  const intronExonRatio = flankMean < 2 ** -1022
    ? (input.intronDepth / scale) / ((input.upstreamExonDepth / scale + input.downstreamExonDepth / scale) / 2)
    : input.intronDepth / flankMean;
  const leftDropFraction = 1 - input.intronDepth / input.upstreamExonDepth;
  const rightRiseFraction = 1 - input.intronDepth / input.downstreamExonDepth;
  if (![intronExonRatio, leftDropFraction, rightRiseFraction].every(Number.isFinite))
    simpleError("intronDepth", "Depth ratios exceed the finite number range.", "result_overflow");
  return { intronExonRatio, leftDropFraction, rightRiseFraction, retentionCandidate: intronExonRatio >= input.minimumIntronExonRatio };
};
export const exampleInput = {
  upstreamExonDepth: 20,
  intronDepth: 10,
  downstreamExonDepth: 20,
  minimumIntronExonRatio: 0.4,
} satisfies Input;
export const exampleOutput = {
  intronExonRatio: 0.5,
  leftDropFraction: 0.5,
  rightRiseFraction: 0.5,
  retentionCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstreamExonDepth: {
      type: "number",
      exclusiveMinimum: 0,
    },
    intronDepth: {
      type: "number",
      minimum: 0,
    },
    downstreamExonDepth: {
      type: "number",
      exclusiveMinimum: 0,
    },
    minimumIntronExonRatio: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["upstreamExonDepth", "intronDepth", "downstreamExonDepth", "minimumIntronExonRatio"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intronExonRatio: {
      type: "number",
      minimum: 0,
    },
    leftDropFraction: {
      type: "number",
      maximum: 1,
    },
    rightRiseFraction: {
      type: "number",
      maximum: 1,
    },
    retentionCandidate: {
      type: "boolean",
    },
  },
  required: ["intronExonRatio", "leftDropFraction", "rightRiseFraction", "retentionCandidate"],
} as const satisfies ToolJsonSchema;

// The shared schema matcher uses Array.every, which skips holes; reject sparse lists explicitly.
const matchesDenseSchema = (value: unknown, schema: ToolJsonSchema): boolean => {
  if (!matchesToolJsonSchema(value, schema)) return false;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (!Object.hasOwn(value, i)) return false;
      if (schema.items && !matchesDenseSchema(value[i], schema.items)) return false;
    }
  } else if (typeof value === "object" && value !== null && schema.properties) {
    const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
    for (const [field, fieldSchema] of Object.entries(schema.properties))
      if (!matchesDenseSchema(fields.get(field), fieldSchema)) return false;
  }
  return true;
};

function validateInput(value: unknown): asserts value is Input {
  if (matchesDenseSchema(value, inputSchema)) return;
  if (typeof value !== "object" || value === null || Array.isArray(value))
    simpleError("", "Input must be an object.", "object_required");
  const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
  for (const field of fields.keys())
    if (!Object.hasOwn(inputSchema.properties, field))
      simpleError(field, `${field} is not a supported input field.`, "unknown_field");
  for (const [field, schema] of Object.entries(inputSchema.properties))
    if (!matchesDenseSchema(fields.get(field), schema))
      simpleError(field, `${field} does not match the declared input schema.`, "invalid_field");
  simpleError("", "Input does not match the tool schema.", "invalid_field");
}

export const run = (input: unknown): ToolResult<Output> => {
  try {
    validateInput(input);
    const output = calculate(input);
    if (!matchesDenseSchema(output, outputSchema))
      throw new Error("Calculation produced output outside its declared schema.");
    return toolSuccess(output);
  } catch (error) {
    if (!(error instanceof SimpleToolError)) throw error;
    return invalidInput([{ code: error.code, field: error.field, message: error.message }]);
  }
};

export const tool = defineTool<Input, Output>({
  contractVersion: 1,
  id: "genomics/intron-coverage-boundary",
  title: "Intron Coverage Boundary",
  description: "Compare intron coverage with flanking exon depth to screen retention evidence.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "upstreamExonDepth",
        label: "Upstream exon depth",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "intronDepth",
        label: "Intron depth",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "downstreamExonDepth",
        label: "Downstream exon depth",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "minimumIntronExonRatio",
        label: "Minimum intron exon ratio",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "intronExonRatio",
        label: "Intron exon ratio",
        valueType: {
          type: "number",
        },
      },
      {
        id: "leftDropFraction",
        label: "Left drop fraction",
        valueType: {
          type: "number",
        },
      },
      {
        id: "rightRiseFraction",
        label: "Right rise fraction",
        valueType: {
          type: "number",
        },
      },
      {
        id: "retentionCandidate",
        label: "Retention candidate",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
