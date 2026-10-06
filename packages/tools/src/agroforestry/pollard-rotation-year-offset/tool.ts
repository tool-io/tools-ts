import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceYear: number;
  readonly recordedYear: number;
  readonly suppliedRotationYears: number;
};
export type Output = {
  readonly elapsedYears: number;
  readonly rotationMarginYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceYear: { type: "integer" },
    recordedYear: { type: "integer" },
    suppliedRotationYears: { type: "integer", minimum: 0 },
  },
  required: ["referenceYear", "recordedYear", "suppliedRotationYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedYears: { type: "integer" },
    rotationMarginYears: { type: "integer" },
  },
  required: ["elapsedYears", "rotationMarginYears"],
} as const;
/** Compare explicit year fields with a supplied rotation length without recommending pruning schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceYear, recordedYear, suppliedRotationYears } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(referenceYear) &&
        referenceYear >= -Number.MAX_SAFE_INTEGER &&
        referenceYear <= Number.MAX_SAFE_INTEGER,
      "referenceYear",
    ),
      referenceYear);
    (H.domain(
      Number.isSafeInteger(recordedYear) &&
        recordedYear >= -Number.MAX_SAFE_INTEGER &&
        recordedYear <= Number.MAX_SAFE_INTEGER,
      "recordedYear",
    ),
      recordedYear);
    (H.domain(
      Number.isSafeInteger(suppliedRotationYears) &&
        suppliedRotationYears >= 0 &&
        suppliedRotationYears <= Number.MAX_SAFE_INTEGER,
      "suppliedRotationYears",
    ),
      suppliedRotationYears);
    return {
      elapsedYears: Number(BigInt(recordedYear) - BigInt(referenceYear)),
      rotationMarginYears: Number(
        BigInt(recordedYear) -
          BigInt(referenceYear) -
          BigInt(suppliedRotationYears),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceYear: 2020, recordedYear: 2026, suppliedRotationYears: 5 },
  output: { elapsedYears: 6, rotationMarginYears: 1 },
} satisfies ToolExample<Input, Output>;
export const pollardRotationYearOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/pollard-rotation-year-offset",
    title: "Pollard Rotation Year Offset",
    description:
      "Compare explicit year fields with a supplied rotation length without recommending pruning schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceYear: { type: "integer" },
        recordedYear: { type: "integer" },
        suppliedRotationYears: { type: "integer", minimum: 0 },
      },
      required: ["referenceYear", "recordedYear", "suppliedRotationYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedYears: { type: "integer" },
        rotationMarginYears: { type: "integer" },
      },
      required: ["elapsedYears", "rotationMarginYears"],
    },
    ports: {
      inputs: [
        {
          id: "referenceYear",
          label: "Reference Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedYear",
          label: "Recorded Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedRotationYears",
          label: "Supplied Rotation Years",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedYears",
          label: "Elapsed Years",
          valueType: { type: "integer" },
        },
        {
          id: "rotationMarginYears",
          label: "Rotation Margin Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollardRotationYearOffsetTool.execute;
export default pollardRotationYearOffsetTool;
