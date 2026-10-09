import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly choiceCount: number };
export type Output = { readonly uniformGuessProbability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { choiceCount: { type: "integer", minimum: 1 } },
  required: ["choiceCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uniformGuessProbability: { type: "number" } },
  required: ["uniformGuessProbability"],
} as const;
/** Return the uniform guessing probability for one correct option among an explicit positive forced-choice option count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { choiceCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(choiceCount) &&
        choiceCount >= 1 &&
        choiceCount <= Number.MAX_SAFE_INTEGER,
      "choiceCount",
    ),
      choiceCount);
    return { uniformGuessProbability: 1 / choiceCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { choiceCount: 4 },
  output: { uniformGuessProbability: 0.25 },
} satisfies ToolExample<Input, Output>;
export const forcedChoiceGuessingRateReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/forced-choice-guessing-rate-reference",
    title: "Forced Choice Guessing Rate Reference Tool",
    description:
      "Return the uniform guessing probability for one correct option among an explicit positive forced-choice option count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { choiceCount: { type: "integer", minimum: 1 } },
      required: ["choiceCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uniformGuessProbability: { type: "number" } },
      required: ["uniformGuessProbability"],
    },
    ports: {
      inputs: [
        {
          id: "choiceCount",
          label: "Choice Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "uniformGuessProbability",
          label: "Uniform Guess Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forcedChoiceGuessingRateReferenceTool.execute;
export default forcedChoiceGuessingRateReferenceTool;
