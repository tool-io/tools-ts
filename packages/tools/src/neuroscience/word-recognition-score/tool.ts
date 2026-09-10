import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyScoredCorrectWordCount: number;
  readonly independentlyAdministeredWordCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyScoredCorrectWordCount",
    label: "Independently scored correct word count",
    kind: "number",
  },
  {
    id: "independentlyAdministeredWordCount",
    label: "Independently administered word count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyAdministeredWordCount, "presented", 1, 10000000);
  bounded(
    input.independentlyScoredCorrectWordCount,
    "correct",
    0,
    input.independentlyAdministeredWordCount,
  );
  return {
    observedWordRecognitionPercent:
      (100 * input.independentlyScoredCorrectWordCount) /
      input.independentlyAdministeredWordCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyScoredCorrectWordCount: 40,
    independentlyAdministeredWordCount: 50,
  },
  output: { result: { observedWordRecognitionPercent: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/word-recognition-score",
  title: "Word Recognition Score Calculator",
  description:
    "Actual clinically administered word-list correct/presented count percentage. List, language, level, presentation/calibration external; not speech reception threshold or etiology.",
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
