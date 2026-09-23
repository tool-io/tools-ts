import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analytePerVolume: number;
  readonly creatininePerVolume: number;
  readonly suppliedCreatinineUnitFactor: number;
};
export type Output = {
  readonly normalized: number;
  readonly convertedCreatinine: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analytePerVolume: { type: "number" },
    creatininePerVolume: { type: "number", exclusiveMinimum: 0 },
    suppliedCreatinineUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "analytePerVolume",
    "creatininePerVolume",
    "suppliedCreatinineUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "number" },
    convertedCreatinine: { type: "number" },
  },
  required: ["normalized", "convertedCreatinine"],
} as const;
/** Normalize supplied research concentrations using a caller-supplied compatible creatinine mass-unit factor; no exposure diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    analytePerVolume,
    creatininePerVolume,
    suppliedCreatinineUnitFactor,
  } = request;
  const compute = (): Output => {
    H.positive(creatininePerVolume);
    H.positive(suppliedCreatinineUnitFactor);
    return {
      normalized:
        analytePerVolume / (creatininePerVolume * suppliedCreatinineUnitFactor),
      convertedCreatinine: creatininePerVolume * suppliedCreatinineUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    analytePerVolume: 20,
    creatininePerVolume: 2,
    suppliedCreatinineUnitFactor: 0.5,
  },
  output: { normalized: 20, convertedCreatinine: 1 },
} satisfies ToolExample<Input, Output>;
export const biomarkerCreatinineUnitBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/biomarker-creatinine-unit-base-flag",
    title: "Biomarker Creatinine Unit Base Flag Tool",
    description:
      "Normalize supplied research concentrations using a caller-supplied compatible creatinine mass-unit factor; no exposure diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analytePerVolume: { type: "number" },
        creatininePerVolume: { type: "number", exclusiveMinimum: 0 },
        suppliedCreatinineUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "analytePerVolume",
        "creatininePerVolume",
        "suppliedCreatinineUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "number" },
        convertedCreatinine: { type: "number" },
      },
      required: ["normalized", "convertedCreatinine"],
    },
    ports: {
      inputs: [
        {
          id: "analytePerVolume",
          label: "Analyte Per Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creatininePerVolume",
          label: "Creatinine Per Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCreatinineUnitFactor",
          label: "Supplied Creatinine Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
        {
          id: "convertedCreatinine",
          label: "Converted Creatinine",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomarkerCreatinineUnitBaseFlagTool.execute;
export default biomarkerCreatinineUnitBaseFlagTool;
