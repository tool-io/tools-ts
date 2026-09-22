import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDepth: number;
  readonly catchFraction: number;
};
export type Output = {
  readonly correctedDepth: number;
  readonly missedDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDepth: { type: "number", minimum: 0 },
    catchFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["measuredDepth", "catchFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedDepth: { type: "number" },
    missedDepth: { type: "number" },
  },
  required: ["correctedDepth", "missedDepth"],
} as const;
/** Calculate rain gauge catch correction factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredDepth, catchFraction } = request;
  const compute = (): Output => {
    H.domain(measuredDepth >= 0 && catchFraction > 0 && catchFraction <= 1);
    return {
      correctedDepth: measuredDepth / catchFraction,
      missedDepth: measuredDepth / catchFraction - measuredDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredDepth: 8, catchFraction: 0.8 },
  output: { correctedDepth: 10, missedDepth: 2 },
} satisfies ToolExample<Input, Output>;
export const rainGaugeCatchCorrectionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/rain-gauge-catch-correction-factor",
    title: "Rain Gauge Catch Correction Factor Tool",
    description:
      "Calculate rain gauge catch correction factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredDepth: { type: "number", minimum: 0 },
        catchFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["measuredDepth", "catchFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedDepth: { type: "number" },
        missedDepth: { type: "number" },
      },
      required: ["correctedDepth", "missedDepth"],
    },
    ports: {
      inputs: [
        {
          id: "measuredDepth",
          label: "Measured Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "catchFraction",
          label: "Catch Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedDepth",
          label: "Corrected Depth",
          valueType: { type: "number" },
        },
        {
          id: "missedDepth",
          label: "Missed Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainGaugeCatchCorrectionFactorTool.execute;
export default rainGaugeCatchCorrectionFactorTool;
