import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type TocInput = {
  readonly inorganicCarbonMgPerL: number;
  readonly totalCarbonMgPerL: number;
};

export type TocOutput = {
  readonly organicCarbonMgPerL: number;
};

export const tocExample = {
  input: { inorganicCarbonMgPerL: 3, totalCarbonMgPerL: 10 },
  output: { organicCarbonMgPerL: 7 },
} satisfies ToolExample<TocInput, TocOutput>;

export const tocInputSchema = {
  additionalProperties: false,
  properties: {
    inorganicCarbonMgPerL: {
      description: "Inorganic carbon concentration in mg/L.",
      minimum: 0,
      type: "number",
    },
    totalCarbonMgPerL: {
      description: "Total carbon concentration in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["inorganicCarbonMgPerL", "totalCarbonMgPerL"],
  type: "object",
} as const;

export const tocOutputSchema = {
  additionalProperties: false,
  properties: {
    organicCarbonMgPerL: {
      description: "Total organic carbon concentration in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["organicCarbonMgPerL"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (
  field: "inorganicCarbonMgPerL" | "totalCarbonMgPerL",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field,
        message: `${field} must be a finite number greater than or equal to zero.`,
      };

export const calculateToc = (input: unknown): ToolResult<TocOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    nonnegativeFiniteIssue(
      "inorganicCarbonMgPerL",
      input.inorganicCarbonMgPerL,
    ),
    nonnegativeFiniteIssue("totalCarbonMgPerL", input.totalCarbonMgPerL),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "inorganicCarbonMgPerL" && field !== "totalCarbonMgPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const inorganic = input.inorganicCarbonMgPerL as number;
  const total = input.totalCarbonMgPerL as number;
  if (inorganic > total)
    return invalidInput([
      {
        code: "inorganic_carbon_exceeds_total",
        field: "inorganicCarbonMgPerL",
        message: "inorganicCarbonMgPerL cannot exceed totalCarbonMgPerL.",
      },
    ]);

  const organicCarbonMgPerL = total - inorganic;
  if (!Number.isFinite(organicCarbonMgPerL) || organicCarbonMgPerL < 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "organicCarbonMgPerL",
        message:
          "Organic carbon could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ organicCarbonMgPerL });
};

export const tocTool = defineTool<TocInput, TocOutput>({
  contractVersion: 1,
  description:
    "Calculate total organic carbon by subtracting inorganic carbon from total carbon.",
  discovery: {
    aliases: ["total organic carbon", "TOC"],
    collections: ["chemistry", "environmental chemistry"],
    fields: ["carbon analysis", "water quality", "organic carbon"],
    keywords: ["TOC", "total carbon", "inorganic carbon"],
  },
  execute: calculateToc,
  execution: { kind: "pure" },
  id: "chemistry/environmental-toc",
  inputSchema: tocInputSchema,
  outputSchema: tocOutputSchema,
  ports: {
    inputs: [
      {
        id: "inorganicCarbonMgPerL",
        label: "Inorganic carbon",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
      {
        id: "totalCarbonMgPerL",
        label: "Total carbon",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
    outputs: [
      {
        id: "organicCarbonMgPerL",
        label: "Organic carbon",
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
  },
  title: "TOC Calculator",
});

export default tocTool;
