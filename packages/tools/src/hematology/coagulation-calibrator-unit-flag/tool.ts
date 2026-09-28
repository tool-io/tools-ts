import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedUnit: string;
  readonly calibratorUnit: string;
  readonly method: string;
  readonly calibratorMethod: string;
};
export type Output = {
  readonly unitMatches: boolean;
  readonly methodMatches: boolean;
  readonly compatibleUnderTokens: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedUnit: { type: "string", maxLength: 8192 },
    calibratorUnit: { type: "string", maxLength: 8192 },
    method: { type: "string", maxLength: 8192 },
    calibratorMethod: { type: "string", maxLength: 8192 },
  },
  required: ["observedUnit", "calibratorUnit", "method", "calibratorMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitMatches: { type: "boolean" },
    methodMatches: { type: "boolean" },
    compatibleUnderTokens: { type: "boolean" },
  },
  required: ["unitMatches", "methodMatches", "compatibleUnderTokens"],
} as const;
/** Literal supplied assay/calibrator metadata check; no coagulation result or conversion factor is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedUnit, calibratorUnit, method, calibratorMethod } = request;
  const compute = (): Output => {
    const unitMatches = observedUnit === calibratorUnit,
      methodMatches = method === calibratorMethod;
    return {
      unitMatches,
      methodMatches,
      compatibleUnderTokens: unitMatches && methodMatches,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedUnit: "u1",
    calibratorUnit: "u1",
    method: "M1",
    calibratorMethod: "M1",
  },
  output: {
    unitMatches: true,
    methodMatches: true,
    compatibleUnderTokens: true,
  },
} satisfies ToolExample<Input, Output>;
export const coagulationCalibratorUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/coagulation-calibrator-unit-flag",
    title: "Coagulation Calibrator Unit Flag Tool",
    description:
      "Literal supplied assay/calibrator metadata check; no coagulation result or conversion factor is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedUnit: { type: "string", maxLength: 8192 },
        calibratorUnit: { type: "string", maxLength: 8192 },
        method: { type: "string", maxLength: 8192 },
        calibratorMethod: { type: "string", maxLength: 8192 },
      },
      required: [
        "observedUnit",
        "calibratorUnit",
        "method",
        "calibratorMethod",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitMatches: { type: "boolean" },
        methodMatches: { type: "boolean" },
        compatibleUnderTokens: { type: "boolean" },
      },
      required: ["unitMatches", "methodMatches", "compatibleUnderTokens"],
    },
    ports: {
      inputs: [
        {
          id: "observedUnit",
          label: "Observed Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "calibratorUnit",
          label: "Calibrator Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "method",
          label: "Method",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "calibratorMethod",
          label: "Calibrator Method",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "unitMatches",
          label: "Unit Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "methodMatches",
          label: "Method Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "compatibleUnderTokens",
          label: "Compatible Under Tokens",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = coagulationCalibratorUnitFlagTool.execute;
export default coagulationCalibratorUnitFlagTool;
