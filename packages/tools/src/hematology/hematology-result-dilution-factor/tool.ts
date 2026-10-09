import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredValue: number;
  readonly suppliedDilutionFactor: number;
  readonly alreadyCorrected: boolean;
};
export type Output = {
  readonly reportedValue: number;
  readonly multiplier: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredValue: { type: "number" },
    suppliedDilutionFactor: { type: "number", exclusiveMinimum: 0 },
    alreadyCorrected: { type: "boolean" },
  },
  required: ["measuredValue", "suppliedDilutionFactor", "alreadyCorrected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    multiplier: { type: "number" },
  },
  required: ["reportedValue", "multiplier"],
} as const;
/** Apply an explicit dilution factor only when the supplied result is marked uncorrected, without selecting a laboratory correction policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredValue, suppliedDilutionFactor, alreadyCorrected } = request;
  const compute = (): Output => {
    (H.domain(suppliedDilutionFactor > 0, "suppliedDilutionFactor"),
      suppliedDilutionFactor);
    return {
      reportedValue: alreadyCorrected
        ? measuredValue
        : measuredValue * suppliedDilutionFactor,
      multiplier: alreadyCorrected ? 1 : suppliedDilutionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredValue: 2,
    suppliedDilutionFactor: 5,
    alreadyCorrected: false,
  },
  output: { reportedValue: 10, multiplier: 5 },
} satisfies ToolExample<Input, Output>;
export const hematologyResultDilutionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/hematology-result-dilution-factor",
    title: "Hematology Result Dilution Factor",
    description:
      "Apply an explicit dilution factor only when the supplied result is marked uncorrected, without selecting a laboratory correction policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredValue: { type: "number" },
        suppliedDilutionFactor: { type: "number", exclusiveMinimum: 0 },
        alreadyCorrected: { type: "boolean" },
      },
      required: ["measuredValue", "suppliedDilutionFactor", "alreadyCorrected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        multiplier: { type: "number" },
      },
      required: ["reportedValue", "multiplier"],
    },
    ports: {
      inputs: [
        {
          id: "measuredValue",
          label: "Measured Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDilutionFactor",
          label: "Supplied Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alreadyCorrected",
          label: "Already Corrected",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedValue",
          label: "Reported Value",
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hematologyResultDilutionFactorTool.execute;
export default hematologyResultDilutionFactorTool;
