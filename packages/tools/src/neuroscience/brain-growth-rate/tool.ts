import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredEarlierBrainVolumeMl: number;
  readonly independentlyMeasuredLaterBrainVolumeMl: number;
  readonly independentlyMeasuredElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredEarlierBrainVolumeMl",
    label: "Independently measured earlier brain volume ml",
    kind: "number",
  },
  {
    id: "independentlyMeasuredLaterBrainVolumeMl",
    label: "Independently measured later brain volume ml",
    kind: "number",
  },
  {
    id: "independentlyMeasuredElapsedYears",
    label: "Independently measured elapsed years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredEarlierBrainVolumeMl, "earlier");
  nonnegative(input.independentlyMeasuredLaterBrainVolumeMl, "later");
  positive(input.independentlyMeasuredElapsedYears, "years");
  return {
    signedObservedChangePerYear:
      (input.independentlyMeasuredLaterBrainVolumeMl -
        input.independentlyMeasuredEarlierBrainVolumeMl) /
      input.independentlyMeasuredElapsedYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredEarlierBrainVolumeMl: 100,
    independentlyMeasuredLaterBrainVolumeMl: 90,
    independentlyMeasuredElapsedYears: 2,
  },
  output: { result: { signedObservedChangePerYear: -5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/brain-growth-rate",
  title: "Brain Growth Rate Calculator",
  description:
    "Signed observed brain volume gain per measured elapsed year using compatible independent observations. Pruning attribution cannot be inferred from density/count changes alone; no universal developmental rate, forecast or age diagnosis.",
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
