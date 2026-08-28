import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type ContactProcessConversionInput = {
  readonly finalSulfurDioxideMol: number;
  readonly initialSulfurDioxideMol: number;
};

export type ContactProcessConversionOutput = {
  readonly conversionPercent: number;
};

export const contactProcessConversionExample = {
  input: { finalSulfurDioxideMol: 3, initialSulfurDioxideMol: 10 },
  output: { conversionPercent: 70 },
} satisfies ToolExample<
  ContactProcessConversionInput,
  ContactProcessConversionOutput
>;

export const contactProcessConversionInputSchema = {
  additionalProperties: false,
  properties: {
    finalSulfurDioxideMol: {
      description: "Final sulfur dioxide amount in moles.",
      minimum: 0,
      type: "number",
    },
    initialSulfurDioxideMol: {
      description: "Initial sulfur dioxide amount in moles.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["finalSulfurDioxideMol", "initialSulfurDioxideMol"],
  type: "object",
} as const;

export const contactProcessConversionOutputSchema = {
  additionalProperties: false,
  properties: {
    conversionPercent: {
      description: "Fraction of sulfur dioxide converted, as a percent.",
      maximum: 100,
      minimum: 0,
      type: "number",
    },
  },
  required: ["conversionPercent"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field: "finalSulfurDioxideMol",
        message:
          "finalSulfurDioxideMol must be a finite number greater than or equal to zero.",
      };

const positiveFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field: "initialSulfurDioxideMol",
        message:
          "initialSulfurDioxideMol must be a finite number greater than zero.",
      };

export const calculateContactProcessConversion = (
  input: unknown,
): ToolResult<ContactProcessConversionOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    nonnegativeFiniteIssue(input.finalSulfurDioxideMol),
    positiveFiniteIssue(input.initialSulfurDioxideMol),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "finalSulfurDioxideMol" &&
          field !== "initialSulfurDioxideMol",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const finalAmount = input.finalSulfurDioxideMol as number;
  const initialAmount = input.initialSulfurDioxideMol as number;
  if (finalAmount > initialAmount)
    return invalidInput([
      {
        code: "final_amount_exceeds_initial",
        field: "finalSulfurDioxideMol",
        message: "finalSulfurDioxideMol cannot exceed initialSulfurDioxideMol.",
      },
    ]);

  const conversionPercent =
    ((initialAmount - finalAmount) / initialAmount) * 100;
  if (
    !Number.isFinite(conversionPercent) ||
    conversionPercent < 0 ||
    conversionPercent > 100
  )
    return invalidInput([
      {
        code: "invalid_output",
        field: "conversionPercent",
        message:
          "Conversion could not be calculated as a finite percentage from zero to 100.",
      },
    ]);

  return toolSuccess({ conversionPercent });
};

export const contactProcessConversionTool = defineTool<
  ContactProcessConversionInput,
  ContactProcessConversionOutput
>({
  contractVersion: 1,
  description:
    "Calculate sulfur dioxide conversion percentage for the Contact process from initial and final amounts.",
  discovery: {
    aliases: ["Contact process conversion", "SO2 conversion"],
    collections: ["chemistry", "industrial chemistry"],
    fields: ["sulfuric acid process", "conversion", "process yield"],
    keywords: [
      "Contact process",
      "sulfur dioxide",
      "SO2",
      "conversion percent",
    ],
  },
  execute: calculateContactProcessConversion,
  execution: { kind: "pure" },
  id: "chemistry/industrial-contact-process-conversion",
  inputSchema: contactProcessConversionInputSchema,
  outputSchema: contactProcessConversionOutputSchema,
  ports: {
    inputs: [
      {
        id: "finalSulfurDioxideMol",
        label: "Final sulfur dioxide",
        required: true,
        valueType: { format: "amount", type: "number", unit: "mol" },
      },
      {
        id: "initialSulfurDioxideMol",
        label: "Initial sulfur dioxide",
        required: true,
        valueType: { format: "amount", type: "number", unit: "mol" },
      },
    ],
    outputs: [
      {
        id: "conversionPercent",
        label: "Conversion",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
    ],
  },
  title: "Contact Process Conversion Calculator",
});

export default contactProcessConversionTool;
