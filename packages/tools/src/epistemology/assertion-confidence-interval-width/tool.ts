import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerProbability: number;
  readonly upperProbability: number;
};
export type Output = { readonly width: number; readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerProbability: { type: "number", minimum: 0, maximum: 1 },
    upperProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["lowerProbability", "upperProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, midpoint: { type: "number" } },
  required: ["width", "midpoint"],
} as const;
/** Report one supplied probabilistic-claim interval width without deriving statistical confidence or validating the assertion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerProbability, upperProbability } = request;
  const compute = (): Output => {
    H.probability(lowerProbability);
    H.probability(upperProbability);
    H.domain(lowerProbability <= upperProbability);
    return {
      width: upperProbability - lowerProbability,
      midpoint: (lowerProbability + upperProbability) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerProbability: 0.2, upperProbability: 0.6 },
  output: { width: 0.39999999999999997, midpoint: 0.4 },
} satisfies ToolExample<Input, Output>;
export const assertionConfidenceIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/assertion-confidence-interval-width",
    title: "Assertion Confidence Interval Width Tool",
    description:
      "Report one supplied probabilistic-claim interval width without deriving statistical confidence or validating the assertion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerProbability: { type: "number", minimum: 0, maximum: 1 },
        upperProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["lowerProbability", "upperProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, midpoint: { type: "number" } },
      required: ["width", "midpoint"],
    },
    ports: {
      inputs: [
        {
          id: "lowerProbability",
          label: "Lower Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperProbability",
          label: "Upper Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = assertionConfidenceIntervalWidthTool.execute;
export default assertionConfidenceIntervalWidthTool;
