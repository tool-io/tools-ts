import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type StandardizationFactorInput = {
  readonly actualConcentrationMolPerL: number;
  readonly nominalConcentrationMolPerL: number;
};

export type StandardizationFactorOutput = {
  readonly standardizationFactor: number;
};

export const standardizationFactorExample = {
  input: {
    actualConcentrationMolPerL: 0.102,
    nominalConcentrationMolPerL: 0.1,
  },
  output: { standardizationFactor: 1.02 },
} satisfies ToolExample<
  StandardizationFactorInput,
  StandardizationFactorOutput
>;

export const standardizationFactorInputSchema = {
  additionalProperties: false,
  properties: {
    actualConcentrationMolPerL: {
      description: "Standardized actual concentration in mol/L.",
      exclusiveMinimum: 0,
      type: "number",
    },
    nominalConcentrationMolPerL: {
      description: "Nominal concentration in mol/L.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["actualConcentrationMolPerL", "nominalConcentrationMolPerL"],
  type: "object",
} as const;

export const standardizationFactorOutputSchema = {
  additionalProperties: false,
  properties: {
    standardizationFactor: {
      description: "Ratio of actual to nominal concentration.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["standardizationFactor"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "actualConcentrationMolPerL" | "nominalConcentrationMolPerL",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

import { roundStatistic } from "../../statistics/input.js";

export const calculateStandardizationFactor = (
  input: unknown,
): ToolResult<StandardizationFactorOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue(
      "actualConcentrationMolPerL",
      input.actualConcentrationMolPerL,
    ),
    positiveFiniteIssue(
      "nominalConcentrationMolPerL",
      input.nominalConcentrationMolPerL,
    ),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "actualConcentrationMolPerL" &&
          field !== "nominalConcentrationMolPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const standardizationFactor =
    (input.actualConcentrationMolPerL as number) /
    (input.nominalConcentrationMolPerL as number);
  if (!Number.isFinite(standardizationFactor) || standardizationFactor <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "standardizationFactor",
        message:
          "Standardization factor could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({
    standardizationFactor: roundStatistic(standardizationFactor),
  });
};

export const standardizationFactorTool = defineTool<
  StandardizationFactorInput,
  StandardizationFactorOutput
>({
  contractVersion: 1,
  description:
    "Calculate an analytical standardization factor as actual concentration divided by nominal concentration.",
  discovery: {
    aliases: [
      "titrant standardization factor",
      "concentration correction factor",
    ],
    collections: ["chemistry", "analytical chemistry"],
    fields: ["standardization", "titration", "concentration factor"],
    keywords: ["actual concentration", "nominal concentration", "factor"],
  },
  execute: calculateStandardizationFactor,
  execution: { kind: "pure" },
  id: "chemistry/analytical-standardization-factor",
  inputSchema: standardizationFactorInputSchema,
  outputSchema: standardizationFactorOutputSchema,
  ports: {
    inputs: [
      {
        id: "actualConcentrationMolPerL",
        label: "Actual concentration",
        required: true,
        valueType: {
          format: "molar-concentration",
          type: "number",
          unit: "mol/L",
        },
      },
      {
        id: "nominalConcentrationMolPerL",
        label: "Nominal concentration",
        required: true,
        valueType: {
          format: "molar-concentration",
          type: "number",
          unit: "mol/L",
        },
      },
    ],
    outputs: [
      {
        id: "standardizationFactor",
        label: "Standardization factor",
        valueType: { format: "correction-factor", type: "number" },
      },
    ],
  },
  title: "Standardization Factor Calculator",
});

export default standardizationFactorTool;
