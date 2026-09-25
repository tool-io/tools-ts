import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gross: number;
  readonly tare: number;
  readonly measurementHalfwidth: number;
};
export type Output = {
  readonly netMass: number;
  readonly lower: number;
  readonly upper: number;
  readonly zeroInside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    tare: { type: "number" },
    measurementHalfwidth: { type: "number", minimum: 0 },
  },
  required: ["gross", "tare", "measurementHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    zeroInside: { type: "boolean" },
  },
  required: ["netMass", "lower", "upper", "zeroInside"],
} as const;
/** Signed tare-corrected mass envelope, not a fill procedure or cryostat readiness check. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gross, tare, measurementHalfwidth } = request;
  const compute = (): Output => {
    H.domain(measurementHalfwidth >= 0);
    return {
      netMass: gross - tare,
      lower: gross - tare - measurementHalfwidth,
      upper: gross - tare + measurementHalfwidth,
      zeroInside: Math.abs(gross - tare) <= measurementHalfwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gross: 10, tare: 9.8, measurementHalfwidth: 0.3 },
  output: {
    netMass: 0.1999999999999993,
    lower: -0.1000000000000007,
    upper: 0.4999999999999993,
    zeroInside: true,
  },
} satisfies ToolExample<Input, Output>;
export const cryostatFillMassZeroGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cryostat-fill-mass-zero-gap",
    title: "Cryostat Fill Mass Zero Gap Tool",
    description:
      "Signed tare-corrected mass envelope, not a fill procedure or cryostat readiness check.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number" },
        tare: { type: "number" },
        measurementHalfwidth: { type: "number", minimum: 0 },
      },
      required: ["gross", "tare", "measurementHalfwidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        zeroInside: { type: "boolean" },
      },
      required: ["netMass", "lower", "upper", "zeroInside"],
    },
    ports: {
      inputs: [
        {
          id: "gross",
          label: "Gross",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tare",
          label: "Tare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementHalfwidth",
          label: "Measurement Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "zeroInside",
          label: "Zero Inside",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryostatFillMassZeroGapTool.execute;
export default cryostatFillMassZeroGapTool;
