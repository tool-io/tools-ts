import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type VoidFractionInput = {
  readonly packingFraction: number;
};

export type VoidFractionOutput = {
  readonly voidFraction: number;
};

export const voidFractionExample = {
  input: { packingFraction: 0.25 },
  output: { voidFraction: 0.75 },
} satisfies ToolExample<VoidFractionInput, VoidFractionOutput>;

export const voidFractionInputSchema = {
  additionalProperties: false,
  properties: {
    packingFraction: {
      description: "Fraction of unit-cell volume occupied by atoms.",
      maximum: 1,
      minimum: 0,
      type: "number",
    },
  },
  required: ["packingFraction"],
  type: "object",
} as const;

export const voidFractionOutputSchema = {
  additionalProperties: false,
  properties: {
    voidFraction: {
      description: "Fraction of unit-cell volume not occupied by atoms.",
      maximum: 1,
      minimum: 0,
      type: "number",
    },
  },
  required: ["voidFraction"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateVoidFraction = (
  input: unknown,
): ToolResult<VoidFractionOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = Object.keys(input)
    .filter((field) => field !== "packingFraction")
    .map((field) => ({
      code: "unknown_field",
      field,
      message: `${field} is not a supported input field.`,
    }));
  const packingFraction = input.packingFraction;
  if (
    typeof packingFraction !== "number" ||
    !Number.isFinite(packingFraction) ||
    packingFraction < 0 ||
    packingFraction > 1
  )
    issues.push({
      code: "fraction_out_of_range",
      field: "packingFraction",
      message: "packingFraction must be a finite number between zero and one.",
    });

  if (issues.length > 0) return invalidInput(issues);

  return toolSuccess({
    voidFraction: 1 - (packingFraction as number),
  });
};

export const voidFractionTool = defineTool<
  VoidFractionInput,
  VoidFractionOutput
>({
  contractVersion: 1,
  description:
    "Calculate the unoccupied fraction of a unit cell as one minus its packing fraction.",
  discovery: {
    aliases: ["unoccupied fraction", "unit-cell void fraction"],
    collections: ["chemistry", "crystallography"],
    fields: ["crystal structure", "packing", "unit cell"],
    keywords: ["empty volume", "packing fraction", "void space"],
  },
  execute: calculateVoidFraction,
  execution: { kind: "pure" },
  id: "chemistry/crystallography-void-fraction",
  inputSchema: voidFractionInputSchema,
  outputSchema: voidFractionOutputSchema,
  ports: {
    inputs: [
      {
        id: "packingFraction",
        label: "Packing fraction",
        required: true,
        valueType: { format: "fraction", type: "number" },
      },
    ],
    outputs: [
      {
        id: "voidFraction",
        label: "Void fraction",
        valueType: { format: "fraction", type: "number" },
      },
    ],
  },
  title: "Void Fraction Calculator",
});

export default voidFractionTool;
