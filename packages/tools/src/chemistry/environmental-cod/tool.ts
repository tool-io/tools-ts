import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type CodInput = {
  readonly blankTitrantVolumeMl: number;
  readonly digestedSampleVolumeMl: number;
  readonly sampleTitrantVolumeMl: number;
  readonly titrantNormalityEqPerL: number;
};

export type CodOutput = {
  readonly codMgPerL: number;
};

export const codExample = {
  input: {
    blankTitrantVolumeMl: 10,
    digestedSampleVolumeMl: 50,
    sampleTitrantVolumeMl: 6,
    titrantNormalityEqPerL: 0.1,
  },
  output: { codMgPerL: 64 },
} satisfies ToolExample<CodInput, CodOutput>;

export const codInputSchema = {
  additionalProperties: false,
  properties: {
    blankTitrantVolumeMl: {
      description: "Blank titrant volume in millilitres.",
      minimum: 0,
      type: "number",
    },
    digestedSampleVolumeMl: {
      description: "Digested sample volume in millilitres.",
      exclusiveMinimum: 0,
      type: "number",
    },
    sampleTitrantVolumeMl: {
      description: "Sample titrant volume in millilitres.",
      minimum: 0,
      type: "number",
    },
    titrantNormalityEqPerL: {
      description: "Titrant normality in equivalents per litre.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: [
    "blankTitrantVolumeMl",
    "digestedSampleVolumeMl",
    "sampleTitrantVolumeMl",
    "titrantNormalityEqPerL",
  ],
  type: "object",
} as const;

export const codOutputSchema = {
  additionalProperties: false,
  properties: {
    codMgPerL: {
      description: "Chemical oxygen demand as oxygen in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["codMgPerL"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (
  field: "blankTitrantVolumeMl" | "sampleTitrantVolumeMl",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field,
        message: `${field} must be a finite number greater than or equal to zero.`,
      };

const positiveFiniteIssue = (
  field: "digestedSampleVolumeMl" | "titrantNormalityEqPerL",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateCod = (input: unknown): ToolResult<CodOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    nonnegativeFiniteIssue("blankTitrantVolumeMl", input.blankTitrantVolumeMl),
    positiveFiniteIssue("digestedSampleVolumeMl", input.digestedSampleVolumeMl),
    nonnegativeFiniteIssue(
      "sampleTitrantVolumeMl",
      input.sampleTitrantVolumeMl,
    ),
    positiveFiniteIssue("titrantNormalityEqPerL", input.titrantNormalityEqPerL),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "blankTitrantVolumeMl" &&
          field !== "digestedSampleVolumeMl" &&
          field !== "sampleTitrantVolumeMl" &&
          field !== "titrantNormalityEqPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const blank = input.blankTitrantVolumeMl as number;
  const sample = input.sampleTitrantVolumeMl as number;
  if (sample > blank)
    return invalidInput([
      {
        code: "sample_titrant_exceeds_blank",
        field: "sampleTitrantVolumeMl",
        message: "sampleTitrantVolumeMl cannot exceed blankTitrantVolumeMl.",
      },
    ]);

  const codMgPerL =
    ((blank - sample) * (input.titrantNormalityEqPerL as number) * 8_000) /
    (input.digestedSampleVolumeMl as number);
  if (!Number.isFinite(codMgPerL) || codMgPerL < 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "codMgPerL",
        message: "COD could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ codMgPerL });
};

export const codTool = defineTool<CodInput, CodOutput>({
  contractVersion: 1,
  description:
    "Calculate chemical oxygen demand from blank and sample titrant volumes, titrant normality, and digested sample volume.",
  discovery: {
    aliases: ["chemical oxygen demand", "COD"],
    collections: ["chemistry", "environmental chemistry"],
    fields: ["water quality", "oxygen demand", "dichromate titration"],
    keywords: ["COD", "blank titration", "normality", "titrant volume"],
  },
  execute: calculateCod,
  execution: { kind: "pure" },
  id: "chemistry/environmental-cod",
  inputSchema: codInputSchema,
  outputSchema: codOutputSchema,
  ports: {
    inputs: [
      {
        id: "blankTitrantVolumeMl",
        label: "Blank titrant volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "digestedSampleVolumeMl",
        label: "Digested sample volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "sampleTitrantVolumeMl",
        label: "Sample titrant volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "titrantNormalityEqPerL",
        label: "Titrant normality",
        required: true,
        valueType: {
          format: "equivalent-concentration",
          type: "number",
          unit: "eq/L",
        },
      },
    ],
    outputs: [
      {
        id: "codMgPerL",
        label: "Chemical oxygen demand",
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
  },
  title: "COD Calculator",
});

export default codTool;
