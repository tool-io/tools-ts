import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massFlowAt: number;
  readonly positionAt: number;
  readonly suppliedTransportLag: number;
  readonly samplePeriod: number;
};
export type Output = {
  readonly clockGap: number;
  readonly correctedGap: number;
  readonly sampleGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massFlowAt: { type: "number" },
    positionAt: { type: "number" },
    suppliedTransportLag: { type: "number", minimum: 0 },
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "massFlowAt",
    "positionAt",
    "suppliedTransportLag",
    "samplePeriod",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clockGap: { type: "number" },
    correctedGap: { type: "number" },
    sampleGap: { type: "number" },
  },
  required: ["clockGap", "correctedGap", "sampleGap"],
} as const;
/** Calculate yield flow clock gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massFlowAt, positionAt, suppliedTransportLag, samplePeriod } =
    request;
  const compute = (): Output => {
    H.domain(suppliedTransportLag >= 0);
    H.positive(samplePeriod);
    return {
      clockGap: massFlowAt - positionAt,
      correctedGap: massFlowAt - positionAt - suppliedTransportLag,
      sampleGap:
        (massFlowAt - positionAt - suppliedTransportLag) / samplePeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    massFlowAt: 10,
    positionAt: 6,
    suppliedTransportLag: 3,
    samplePeriod: 0.5,
  },
  output: { clockGap: 4, correctedGap: 1, sampleGap: 2 },
} satisfies ToolExample<Input, Output>;
export const yieldFlowClockGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "precision-agriculture/yield-flow-clock-gap",
    title: "Yield Flow Clock Gap Tool",
    description:
      "Calculate yield flow clock gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massFlowAt: { type: "number" },
        positionAt: { type: "number" },
        suppliedTransportLag: { type: "number", minimum: 0 },
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "massFlowAt",
        "positionAt",
        "suppliedTransportLag",
        "samplePeriod",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clockGap: { type: "number" },
        correctedGap: { type: "number" },
        sampleGap: { type: "number" },
      },
      required: ["clockGap", "correctedGap", "sampleGap"],
    },
    ports: {
      inputs: [
        {
          id: "massFlowAt",
          label: "Mass Flow At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positionAt",
          label: "Position At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTransportLag",
          label: "Supplied Transport Lag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clockGap", label: "Clock Gap", valueType: { type: "number" } },
        {
          id: "correctedGap",
          label: "Corrected Gap",
          valueType: { type: "number" },
        },
        { id: "sampleGap", label: "Sample Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = yieldFlowClockGapTool.execute;
export default yieldFlowClockGapTool;
