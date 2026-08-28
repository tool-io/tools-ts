import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type HardnessCaco3Input = {
  readonly calciumMgPerL: number;
  readonly magnesiumMgPerL: number;
};

export type HardnessCaco3Output = {
  readonly hardnessMgPerLAsCaCO3: number;
};

const CALCIUM_TO_CACO3_FACTOR = 2.497;
const MAGNESIUM_TO_CACO3_FACTOR = 4.118;

export const hardnessCaco3Example = {
  input: { calciumMgPerL: 40, magnesiumMgPerL: 12 },
  output: {
    hardnessMgPerLAsCaCO3:
      CALCIUM_TO_CACO3_FACTOR * 40 + MAGNESIUM_TO_CACO3_FACTOR * 12,
  },
} satisfies ToolExample<HardnessCaco3Input, HardnessCaco3Output>;

export const hardnessCaco3InputSchema = {
  additionalProperties: false,
  properties: {
    calciumMgPerL: {
      description: "Calcium concentration in mg/L as elemental calcium.",
      minimum: 0,
      type: "number",
    },
    magnesiumMgPerL: {
      description: "Magnesium concentration in mg/L as elemental magnesium.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["calciumMgPerL", "magnesiumMgPerL"],
  type: "object",
} as const;

export const hardnessCaco3OutputSchema = {
  additionalProperties: false,
  properties: {
    hardnessMgPerLAsCaCO3: {
      description: "Total hardness reported as mg/L CaCO3.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["hardnessMgPerLAsCaCO3"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (
  field: "calciumMgPerL" | "magnesiumMgPerL",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field,
        message: `${field} must be a finite number greater than or equal to zero.`,
      };

export const calculateHardnessCaco3 = (
  input: unknown,
): ToolResult<HardnessCaco3Output> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    nonnegativeFiniteIssue("calciumMgPerL", input.calciumMgPerL),
    nonnegativeFiniteIssue("magnesiumMgPerL", input.magnesiumMgPerL),
    ...Object.keys(input)
      .filter(
        (field) => field !== "calciumMgPerL" && field !== "magnesiumMgPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const hardnessMgPerLAsCaCO3 =
    CALCIUM_TO_CACO3_FACTOR * (input.calciumMgPerL as number) +
    MAGNESIUM_TO_CACO3_FACTOR * (input.magnesiumMgPerL as number);
  if (!Number.isFinite(hardnessMgPerLAsCaCO3) || hardnessMgPerLAsCaCO3 < 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "hardnessMgPerLAsCaCO3",
        message:
          "Hardness could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ hardnessMgPerLAsCaCO3 });
};

export const hardnessCaco3Tool = defineTool<
  HardnessCaco3Input,
  HardnessCaco3Output
>({
  contractVersion: 1,
  description:
    "Calculate water hardness as calcium carbonate equivalent from calcium and magnesium concentrations.",
  discovery: {
    aliases: ["total hardness as CaCO3", "water hardness"],
    collections: ["chemistry", "environmental chemistry"],
    fields: ["water quality", "hardness", "calcium", "magnesium"],
    keywords: ["CaCO3", "calcium hardness", "magnesium hardness"],
  },
  execute: calculateHardnessCaco3,
  execution: { kind: "pure" },
  id: "chemistry/environmental-hardness-caco3",
  inputSchema: hardnessCaco3InputSchema,
  outputSchema: hardnessCaco3OutputSchema,
  ports: {
    inputs: [
      {
        id: "calciumMgPerL",
        label: "Calcium concentration",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
      {
        id: "magnesiumMgPerL",
        label: "Magnesium concentration",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
    outputs: [
      {
        id: "hardnessMgPerLAsCaCO3",
        label: "Hardness as CaCO3",
        valueType: {
          format: "concentration",
          type: "number",
          unit: "mg/L as CaCO3",
        },
      },
    ],
  },
  title: "Hardness as CaCO3 Calculator",
});

export default hardnessCaco3Tool;
