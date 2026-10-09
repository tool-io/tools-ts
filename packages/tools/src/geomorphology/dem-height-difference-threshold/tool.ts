import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly laterHeight: number;
  readonly earlierHeight: number;
  readonly suppliedThreshold: number;
};
export type Output = {
  readonly heightChange: number;
  readonly exceedsMagnitudeThreshold: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    laterHeight: { type: "number" },
    earlierHeight: { type: "number" },
    suppliedThreshold: { type: "number", minimum: 0 },
  },
  required: ["laterHeight", "earlierHeight", "suppliedThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightChange: { type: "number" },
    exceedsMagnitudeThreshold: { type: "boolean" },
  },
  required: ["heightChange", "exceedsMagnitudeThreshold"],
} as const;
/** Compare a supplied DEM elevation change with an explicit strict magnitude threshold without estimating survey uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { laterHeight, earlierHeight, suppliedThreshold } = request;
  const compute = (): Output => {
    H.domain(suppliedThreshold >= 0, "suppliedThreshold");
    return {
      heightChange: laterHeight - earlierHeight,
      exceedsMagnitudeThreshold:
        Math.abs(laterHeight - earlierHeight) > suppliedThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { laterHeight: 105, earlierHeight: 100, suppliedThreshold: 2 },
  output: { heightChange: 5, exceedsMagnitudeThreshold: true },
} satisfies ToolExample<Input, Output>;
export const demHeightDifferenceThresholdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geomorphology", "earth and environmental sciences"],
      keywords: ["geomorphology", "earth and environmental sciences"],
    },
    id: "geomorphology/dem-height-difference-threshold",
    title: "Dem Height Difference Threshold",
    description:
      "Compare a supplied DEM elevation change with an explicit strict magnitude threshold without estimating survey uncertainty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laterHeight: { type: "number" },
        earlierHeight: { type: "number" },
        suppliedThreshold: { type: "number", minimum: 0 },
      },
      required: ["laterHeight", "earlierHeight", "suppliedThreshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightChange: { type: "number" },
        exceedsMagnitudeThreshold: { type: "boolean" },
      },
      required: ["heightChange", "exceedsMagnitudeThreshold"],
    },
    ports: {
      inputs: [
        {
          id: "laterHeight",
          label: "Later Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earlierHeight",
          label: "Earlier Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightChange",
          label: "Height Change",
          valueType: { type: "number" },
        },
        {
          id: "exceedsMagnitudeThreshold",
          label: "Exceeds Magnitude Threshold",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = demHeightDifferenceThresholdTool.execute;
export default demHeightDifferenceThresholdTool;
