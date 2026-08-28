import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type TitrationBlankCorrectionInput = {
  readonly blankTitrantVolumeMl: number;
  readonly sampleTitrantVolumeMl: number;
};

export type TitrationBlankCorrectionOutput = {
  readonly correctedTitrantVolumeMl: number;
};

export const titrationBlankCorrectionExample = {
  input: { blankTitrantVolumeMl: 2, sampleTitrantVolumeMl: 12 },
  output: { correctedTitrantVolumeMl: 10 },
} satisfies ToolExample<
  TitrationBlankCorrectionInput,
  TitrationBlankCorrectionOutput
>;

export const titrationBlankCorrectionInputSchema = {
  additionalProperties: false,
  properties: {
    blankTitrantVolumeMl: {
      description: "Titrant volume consumed by the blank in millilitres.",
      minimum: 0,
      type: "number",
    },
    sampleTitrantVolumeMl: {
      description: "Titrant volume consumed by the sample in millilitres.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["blankTitrantVolumeMl", "sampleTitrantVolumeMl"],
  type: "object",
} as const;

export const titrationBlankCorrectionOutputSchema = {
  additionalProperties: false,
  properties: {
    correctedTitrantVolumeMl: {
      description: "Blank-corrected titrant volume in millilitres.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["correctedTitrantVolumeMl"],
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

export const calculateTitrationBlankCorrection = (
  input: unknown,
): ToolResult<TitrationBlankCorrectionOutput> => {
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
    nonnegativeFiniteIssue(
      "sampleTitrantVolumeMl",
      input.sampleTitrantVolumeMl,
    ),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "blankTitrantVolumeMl" && field !== "sampleTitrantVolumeMl",
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
  if (sample < blank)
    return invalidInput([
      {
        code: "blank_volume_exceeds_sample",
        field: "blankTitrantVolumeMl",
        message: "blankTitrantVolumeMl cannot exceed sampleTitrantVolumeMl.",
      },
    ]);

  const correctedTitrantVolumeMl = sample - blank;
  if (
    !Number.isFinite(correctedTitrantVolumeMl) ||
    correctedTitrantVolumeMl < 0
  )
    return invalidInput([
      {
        code: "invalid_output",
        field: "correctedTitrantVolumeMl",
        message:
          "Corrected volume could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ correctedTitrantVolumeMl });
};

export const titrationBlankCorrectionTool = defineTool<
  TitrationBlankCorrectionInput,
  TitrationBlankCorrectionOutput
>({
  contractVersion: 1,
  description:
    "Correct a titration sample volume by subtracting the titrant volume consumed by a blank.",
  discovery: {
    aliases: ["blank-corrected titration volume", "titration blank correction"],
    collections: ["chemistry", "analytical chemistry"],
    fields: ["titration", "blank correction", "volumetric analysis"],
    keywords: ["blank", "sample titrant", "corrected volume"],
  },
  execute: calculateTitrationBlankCorrection,
  execution: { kind: "pure" },
  id: "chemistry/analytical-titration-blank-correction",
  inputSchema: titrationBlankCorrectionInputSchema,
  outputSchema: titrationBlankCorrectionOutputSchema,
  ports: {
    inputs: [
      {
        id: "blankTitrantVolumeMl",
        label: "Blank titrant volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "sampleTitrantVolumeMl",
        label: "Sample titrant volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
    ],
    outputs: [
      {
        id: "correctedTitrantVolumeMl",
        label: "Corrected titrant volume",
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
    ],
  },
  title: "Titration Blank Correction Calculator",
});

export default titrationBlankCorrectionTool;
