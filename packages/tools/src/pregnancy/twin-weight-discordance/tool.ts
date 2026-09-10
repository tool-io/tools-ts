import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly twinOneIndependentlyEstimatedWeightGrams: number;
  readonly twinTwoIndependentlyEstimatedWeightGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "twinOneIndependentlyEstimatedWeightGrams",
    label: "Twin one independently estimated weight grams",
    kind: "number",
  },
  {
    id: "twinTwoIndependentlyEstimatedWeightGrams",
    label: "Twin two independently estimated weight grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.twinOneIndependentlyEstimatedWeightGrams, "weight");
  positive(input.twinTwoIndependentlyEstimatedWeightGrams, "weight");
  const m = Math.max(
    input.twinOneIndependentlyEstimatedWeightGrams,
    input.twinTwoIndependentlyEstimatedWeightGrams,
  );
  return {
    observedEstimatedWeightDiscordancePercent:
      (100 *
        Math.abs(
          input.twinOneIndependentlyEstimatedWeightGrams -
            input.twinTwoIndependentlyEstimatedWeightGrams,
        )) /
      m,
    largerEstimatedTwinIndices: [
      input.twinOneIndependentlyEstimatedWeightGrams,
      input.twinTwoIndependentlyEstimatedWeightGrams,
    ].flatMap((v, i) => (v === m ? [i + 1] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    twinOneIndependentlyEstimatedWeightGrams: 1000,
    twinTwoIndependentlyEstimatedWeightGrams: 1200,
  },
  output: {
    result: {
      observedEstimatedWeightDiscordancePercent: 16.666666666666668,
      largerEstimatedTwinIndices: [2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/twin-weight-discordance",
  title: "Twin Weight Discordance Calculator",
  description:
    "Twin EFWdiscordance using explicitly larger-weight denominator, retaining equal-weight ties. Not actual growth disorder, chorionicity-specific diagnosis or intervention threshold; qualified measurements/dating required.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
