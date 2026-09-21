import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly zeroMeasured: number;
  readonly spanMeasured: number;
  readonly spanReference: number;
};
export type Output = {
  readonly zeroCorrected: number;
  readonly spanFactor: number;
  readonly corrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    zeroMeasured: { type: "number" },
    spanMeasured: { type: "number" },
    spanReference: { type: "number" },
  },
  required: ["observed", "zeroMeasured", "spanMeasured", "spanReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroCorrected: { type: "number" },
    spanFactor: { type: "number" },
    corrected: { type: "number" },
  },
  required: ["zeroCorrected", "spanFactor", "corrected"],
} as const;
/** Apply supplied bench zero/span observations as a two-anchor correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, zeroMeasured, spanMeasured, spanReference } = request;
  const compute = (): Output => {
    H.domain(spanMeasured !== zeroMeasured, "spanMeasured");
    return {
      zeroCorrected: observed - zeroMeasured,
      spanFactor: spanReference / (spanMeasured - zeroMeasured),
      corrected:
        ((observed - zeroMeasured) * spanReference) /
        (spanMeasured - zeroMeasured),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observed: 12,
    zeroMeasured: 2,
    spanMeasured: 22,
    spanReference: 100,
  },
  output: { zeroCorrected: 10, spanFactor: 5, corrected: 50 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaGasSensorZeroSpanGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/anesthesia-gas-sensor-zero-span-gap",
    title: "Anesthesia Gas Sensor Zero Span Gap Tool",
    description:
      "Apply supplied bench zero/span observations as a two-anchor correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        zeroMeasured: { type: "number" },
        spanMeasured: { type: "number" },
        spanReference: { type: "number" },
      },
      required: ["observed", "zeroMeasured", "spanMeasured", "spanReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroCorrected: { type: "number" },
        spanFactor: { type: "number" },
        corrected: { type: "number" },
      },
      required: ["zeroCorrected", "spanFactor", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroMeasured",
          label: "Zero Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spanMeasured",
          label: "Span Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spanReference",
          label: "Span Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "zeroCorrected",
          label: "Zero Corrected",
          valueType: { type: "number" },
        },
        {
          id: "spanFactor",
          label: "Span Factor",
          valueType: { type: "number" },
        },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaGasSensorZeroSpanGapTool.execute;
export default anesthesiaGasSensorZeroSpanGapTool;
