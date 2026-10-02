import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly observed: number;
};
export type Output = {
  readonly expected: number;
  readonly excess: number;
  readonly residualSurvival: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0, maximum: 1 },
    second: { type: "number", minimum: 0, maximum: 1 },
    observed: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["first", "second", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "number" },
    excess: { type: "number" },
    residualSurvival: { type: "number" },
  },
  required: ["expected", "excess", "residualSurvival"],
} as const;
/** One supplied Bliss independence contrast for bounded research effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, observed } = request;
  const compute = (): Output => {
    H.probability(first);
    H.probability(second);
    H.probability(observed);
    return {
      expected: first + second - first * second,
      excess: observed - first - second + first * second,
      residualSurvival: (1 - first) * (1 - second),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0.2, second: 0.5, observed: 0.7 },
  output: { expected: 0.6, excess: 0.09999999999999995, residualSurvival: 0.4 },
} satisfies ToolExample<Input, Output>;
export const pdResearchCombinationBlissOnePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-research-combination-bliss-one-pair",
    title: "PD Research Combination Bliss One Pair Tool",
    description:
      "One supplied Bliss independence contrast for bounded research effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0, maximum: 1 },
        second: { type: "number", minimum: 0, maximum: 1 },
        observed: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["first", "second", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "number" },
        excess: { type: "number" },
        residualSurvival: { type: "number" },
      },
      required: ["expected", "excess", "residualSurvival"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "expected", label: "Expected", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
        {
          id: "residualSurvival",
          label: "Residual Survival",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdResearchCombinationBlissOnePairTool.execute;
export default pdResearchCombinationBlissOnePairTool;
