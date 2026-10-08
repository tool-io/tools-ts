import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLevel: number;
  readonly emptyLevel: number;
  readonly fullLevel: number;
};
export type Output = {
  readonly fillPercent: number;
  readonly withinCalibrationSpan: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLevel: { type: "number" },
    emptyLevel: { type: "number" },
    fullLevel: { type: "number" },
  },
  required: ["measuredLevel", "emptyLevel", "fullLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fillPercent: { type: "number" },
    withinCalibrationSpan: { type: "boolean" },
  },
  required: ["fillPercent", "withinCalibrationSpan"],
} as const;
/** Linearly reference a reservoir level to explicit empty/full calibration points without equating level percent with volume percent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLevel, emptyLevel, fullLevel } = request;
  const compute = (): Output => {
    H.domain(fullLevel > emptyLevel, "fullLevel");
    return {
      fillPercent:
        (100 * (measuredLevel - emptyLevel)) / (fullLevel - emptyLevel),
      withinCalibrationSpan:
        measuredLevel >= emptyLevel && measuredLevel <= fullLevel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredLevel: 60, emptyLevel: 10, fullLevel: 110 },
  output: { fillPercent: 50, withinCalibrationSpan: true },
} satisfies ToolExample<Input, Output>;
export const cryogenicReservoirLevelPercentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cryogenic-reservoir-level-percent",
    title: "Cryogenic Reservoir Level Percent",
    description:
      "Linearly reference a reservoir level to explicit empty/full calibration points without equating level percent with volume percent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLevel: { type: "number" },
        emptyLevel: { type: "number" },
        fullLevel: { type: "number" },
      },
      required: ["measuredLevel", "emptyLevel", "fullLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fillPercent: { type: "number" },
        withinCalibrationSpan: { type: "boolean" },
      },
      required: ["fillPercent", "withinCalibrationSpan"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLevel",
          label: "Measured Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emptyLevel",
          label: "Empty Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullLevel",
          label: "Full Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fillPercent",
          label: "Fill Percent",
          valueType: { type: "number" },
        },
        {
          id: "withinCalibrationSpan",
          label: "Within Calibration Span",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryogenicReservoirLevelPercentTool.execute;
export default cryogenicReservoirLevelPercentTool;
