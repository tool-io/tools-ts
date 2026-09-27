import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zeroRate: number;
  readonly maturity: number;
  readonly zeroRateSlope: number;
};
export type Output = {
  readonly instantaneousForward: number;
  readonly slopeContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroRate: { type: "number" },
    maturity: { type: "number", minimum: 0 },
    zeroRateSlope: { type: "number" },
  },
  required: ["zeroRate", "maturity", "zeroRateSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instantaneousForward: { type: "number" },
    slopeContribution: { type: "number" },
  },
  required: ["instantaneousForward", "slopeContribution"],
} as const;
/** Use the supplied continuously compounded zero-rate derivative in f(t)=r(t)+t*r′(t). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zeroRate, maturity, zeroRateSlope } = request;
  const compute = (): Output => {
    H.domain(maturity >= 0);
    return {
      instantaneousForward: zeroRate + maturity * zeroRateSlope,
      slopeContribution: maturity * zeroRateSlope,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zeroRate: 0.03, maturity: 2, zeroRateSlope: 0.01 },
  output: { instantaneousForward: 0.05, slopeContribution: 0.02 },
} satisfies ToolExample<Input, Output>;
export const yieldCurveForwardSlopeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/yield-curve-forward-slope-term",
    title: "Yield Curve Forward Slope Term Tool",
    description:
      "Use the supplied continuously compounded zero-rate derivative in f(t)=r(t)+t*r′(t).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroRate: { type: "number" },
        maturity: { type: "number", minimum: 0 },
        zeroRateSlope: { type: "number" },
      },
      required: ["zeroRate", "maturity", "zeroRateSlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instantaneousForward: { type: "number" },
        slopeContribution: { type: "number" },
      },
      required: ["instantaneousForward", "slopeContribution"],
    },
    ports: {
      inputs: [
        {
          id: "zeroRate",
          label: "Zero Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maturity",
          label: "Maturity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroRateSlope",
          label: "Zero Rate Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "instantaneousForward",
          label: "Instantaneous Forward",
          valueType: { type: "number" },
        },
        {
          id: "slopeContribution",
          label: "Slope Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = yieldCurveForwardSlopeTermTool.execute;
export default yieldCurveForwardSlopeTermTool;
