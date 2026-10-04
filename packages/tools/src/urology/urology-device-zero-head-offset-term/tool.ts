import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawPressure: number;
  readonly zeroOffset: number;
  readonly liquidDensity: number;
  readonly gravity: number;
  readonly referenceHeight: number;
};
export type Output = {
  readonly hydrostaticOffset: number;
  readonly zeroCorrected: number;
  readonly referenceCorrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawPressure: { type: "number" },
    zeroOffset: { type: "number" },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    referenceHeight: { type: "number" },
  },
  required: [
    "rawPressure",
    "zeroOffset",
    "liquidDensity",
    "gravity",
    "referenceHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hydrostaticOffset: { type: "number" },
    zeroCorrected: { type: "number" },
    referenceCorrected: { type: "number" },
  },
  required: ["hydrostaticOffset", "zeroCorrected", "referenceCorrected"],
} as const;
/** Subtract explicit zero and hydrostatic reference offsets from a bench pressure record, without device setup or clinical guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawPressure, zeroOffset, liquidDensity, gravity, referenceHeight } =
    request;
  const compute = (): Output => {
    H.positive(liquidDensity);
    H.positive(gravity);
    return {
      hydrostaticOffset: liquidDensity * gravity * referenceHeight,
      zeroCorrected: rawPressure - zeroOffset,
      referenceCorrected:
        rawPressure - zeroOffset - liquidDensity * gravity * referenceHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rawPressure: 2000,
    zeroOffset: 100,
    liquidDensity: 1000,
    gravity: 10,
    referenceHeight: 0.05,
  },
  output: {
    hydrostaticOffset: 500,
    zeroCorrected: 1900,
    referenceCorrected: 1400,
  },
} satisfies ToolExample<Input, Output>;
export const urologyDeviceZeroHeadOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/urology-device-zero-head-offset-term",
    title: "Urology Device Zero Head Offset Term Tool",
    description:
      "Subtract explicit zero and hydrostatic reference offsets from a bench pressure record, without device setup or clinical guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawPressure: { type: "number" },
        zeroOffset: { type: "number" },
        liquidDensity: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        referenceHeight: { type: "number" },
      },
      required: [
        "rawPressure",
        "zeroOffset",
        "liquidDensity",
        "gravity",
        "referenceHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hydrostaticOffset: { type: "number" },
        zeroCorrected: { type: "number" },
        referenceCorrected: { type: "number" },
      },
      required: ["hydrostaticOffset", "zeroCorrected", "referenceCorrected"],
    },
    ports: {
      inputs: [
        {
          id: "rawPressure",
          label: "Raw Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroOffset",
          label: "Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidDensity",
          label: "Liquid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "hydrostaticOffset",
          label: "Hydrostatic Offset",
          valueType: { type: "number" },
        },
        {
          id: "zeroCorrected",
          label: "Zero Corrected",
          valueType: { type: "number" },
        },
        {
          id: "referenceCorrected",
          label: "Reference Corrected",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urologyDeviceZeroHeadOffsetTermTool.execute;
export default urologyDeviceZeroHeadOffsetTermTool;
