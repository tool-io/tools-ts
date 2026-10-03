import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly firstOnly: number;
  readonly secondOnly: number;
  readonly alpha: number;
  readonly beta: number;
};
export type Output = {
  readonly score: number;
  readonly alphaDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "number" },
    firstOnly: { type: "number" },
    secondOnly: { type: "number" },
    alpha: { type: "number" },
    beta: { type: "number" },
  },
  required: ["intersection", "firstOnly", "secondOnly", "alpha", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    alphaDerivative: { type: "number" },
  },
  required: ["score", "alphaDerivative"],
} as const;
/** Calculate tversky one sided penalty parameter from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, firstOnly, secondOnly, alpha, beta } = request;
  const compute = (): Output => {
    H.domain(
      [intersection, firstOnly, secondOnly, alpha, beta].every((x) => x >= 0),
    );
    const d = intersection + alpha * firstOnly + beta * secondOnly;
    H.positive(d);
    return {
      score: intersection / d,
      alphaDerivative: (-intersection * firstOnly) / (d * d),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 3, firstOnly: 2, secondOnly: 1, alpha: 0.5, beta: 1 },
  output: { score: 0.6, alphaDerivative: -0.24 },
} satisfies ToolExample<Input, Output>;
export const tverskyOneSidedPenaltyParameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/tversky-one-sided-penalty-parameter",
    title: "Tversky One Sided Penalty Parameter Tool",
    description:
      "Calculate tversky one sided penalty parameter from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersection: { type: "number" },
        firstOnly: { type: "number" },
        secondOnly: { type: "number" },
        alpha: { type: "number" },
        beta: { type: "number" },
      },
      required: ["intersection", "firstOnly", "secondOnly", "alpha", "beta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        alphaDerivative: { type: "number" },
      },
      required: ["score", "alphaDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "intersection",
          label: "Intersection",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOnly",
          label: "First Only",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOnly",
          label: "Second Only",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beta",
          label: "Beta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "score", label: "Score", valueType: { type: "number" } },
        {
          id: "alphaDerivative",
          label: "Alpha Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tverskyOneSidedPenaltyParameterTool.execute;
export default tverskyOneSidedPenaltyParameterTool;
