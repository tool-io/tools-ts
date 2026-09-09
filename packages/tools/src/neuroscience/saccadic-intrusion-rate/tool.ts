import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCountedSaccadicIntrusions: number;
  readonly actualValidObservationSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCountedSaccadicIntrusions",
    label: "Independently counted saccadic intrusions",
    kind: "number",
  },
  {
    id: "actualValidObservationSeconds",
    label: "Actual valid observation seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyCountedSaccadicIntrusions, "count", 0, 10000000);
  positive(input.actualValidObservationSeconds, "seconds");
  return {
    observedSaccadicIntrusionsPerMinute:
      (60 * input.independentlyCountedSaccadicIntrusions) /
      input.actualValidObservationSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCountedSaccadicIntrusions: 6,
    actualValidObservationSeconds: 30,
  },
  output: { result: { observedSaccadicIntrusionsPerMinute: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/saccadic-intrusion-rate",
  title: "Saccadic Intrusion Rate Calculator",
  description:
    "Actual independently classified saccadic intrusion events per valid observation time, not automated eye tracking, etiology or a neurological threshold.",
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
