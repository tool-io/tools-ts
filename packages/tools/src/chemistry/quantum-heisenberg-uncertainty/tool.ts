import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type HeisenbergUncertaintyInput = {
  readonly positionUncertaintyM: number;
};

export type HeisenbergUncertaintyOutput = {
  readonly minimumMomentumUncertaintyKgMs: number;
};

const PLANCK_CONSTANT_J_S = 6.626_070_15e-34;

export const heisenbergUncertaintyExample = {
  input: { positionUncertaintyM: 1e-10 },
  output: {
    minimumMomentumUncertaintyKgMs: 5.272859088230782e-25,
  },
} satisfies ToolExample<
  HeisenbergUncertaintyInput,
  HeisenbergUncertaintyOutput
>;

export const heisenbergUncertaintyInputSchema = {
  additionalProperties: false,
  properties: {
    positionUncertaintyM: {
      description: "Position uncertainty in metres.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["positionUncertaintyM"],
  type: "object",
} as const;

export const heisenbergUncertaintyOutputSchema = {
  additionalProperties: false,
  properties: {
    minimumMomentumUncertaintyKgMs: {
      description:
        "Minimum momentum uncertainty in kilogram metres per second.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["minimumMomentumUncertaintyKgMs"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateHeisenbergUncertainty = (
  input: unknown,
): ToolResult<HeisenbergUncertaintyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = Object.keys(input)
    .filter((field) => field !== "positionUncertaintyM")
    .map((field) => ({
      code: "unknown_field",
      field,
      message: `${field} is not a supported input field.`,
    }));
  const positionUncertaintyM = input.positionUncertaintyM;
  if (
    typeof positionUncertaintyM !== "number" ||
    !Number.isFinite(positionUncertaintyM) ||
    positionUncertaintyM <= 0
  )
    issues.push({
      code: "positive_finite_number_required",
      field: "positionUncertaintyM",
      message:
        "positionUncertaintyM must be a finite number greater than zero.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const minimumMomentumUncertaintyKgMs =
    PLANCK_CONSTANT_J_S / (4 * Math.PI * (positionUncertaintyM as number));
  if (
    !Number.isFinite(minimumMomentumUncertaintyKgMs) ||
    minimumMomentumUncertaintyKgMs <= 0
  )
    return invalidInput([
      {
        code: "invalid_output",
        field: "minimumMomentumUncertaintyKgMs",
        message:
          "Momentum uncertainty could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ minimumMomentumUncertaintyKgMs });
};

export const heisenbergUncertaintyTool = defineTool<
  HeisenbergUncertaintyInput,
  HeisenbergUncertaintyOutput
>({
  contractVersion: 1,
  description:
    "Calculate the minimum momentum uncertainty allowed by Heisenberg's uncertainty relation for a given position uncertainty.",
  discovery: {
    aliases: ["uncertainty principle", "minimum momentum uncertainty"],
    collections: ["chemistry", "quantum mechanics"],
    fields: ["momentum", "position", "quantum physics"],
    keywords: ["delta p", "delta x", "Heisenberg", "uncertainty"],
  },
  execute: calculateHeisenbergUncertainty,
  execution: { kind: "pure" },
  id: "chemistry/quantum-heisenberg-uncertainty",
  inputSchema: heisenbergUncertaintyInputSchema,
  outputSchema: heisenbergUncertaintyOutputSchema,
  ports: {
    inputs: [
      {
        id: "positionUncertaintyM",
        label: "Position uncertainty",
        required: true,
        valueType: {
          format: "position-uncertainty",
          type: "number",
          unit: "m",
        },
      },
    ],
    outputs: [
      {
        id: "minimumMomentumUncertaintyKgMs",
        label: "Minimum momentum uncertainty",
        valueType: {
          format: "momentum-uncertainty",
          type: "number",
          unit: "kg·m/s",
        },
      },
    ],
  },
  title: "Heisenberg Uncertainty Calculator",
});

export default heisenbergUncertaintyTool;
