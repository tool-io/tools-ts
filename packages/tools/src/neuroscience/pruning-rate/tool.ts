import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredEarlierSynapseCount: number;
  readonly independentlyMeasuredLaterSynapseCount: number;
  readonly independentlyMeasuredElapsedYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredEarlierSynapseCount",
    label: "Independently measured earlier synapse count",
    kind: "number",
  },
  {
    id: "independentlyMeasuredLaterSynapseCount",
    label: "Independently measured later synapse count",
    kind: "number",
  },
  {
    id: "independentlyMeasuredElapsedYears",
    label: "Independently measured elapsed years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.independentlyMeasuredEarlierSynapseCount, "earlier");
  nonnegative(input.independentlyMeasuredLaterSynapseCount, "later");
  positive(input.independentlyMeasuredElapsedYears, "years");
  return {
    signedObservedChangePerYear:
      (input.independentlyMeasuredEarlierSynapseCount -
        input.independentlyMeasuredLaterSynapseCount) /
      input.independentlyMeasuredElapsedYears,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredEarlierSynapseCount: 100,
    independentlyMeasuredLaterSynapseCount: 90,
    independentlyMeasuredElapsedYears: 2,
  },
  output: { result: { signedObservedChangePerYear: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/pruning-rate",
  title: "Pruning Rate Calculator",
  description:
    "Signed observed synapse loss per measured elapsed year using compatible independent observations. Pruning attribution cannot be inferred from density/count changes alone; no universal developmental rate, forecast or age diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedObservedChangePerYear: { type: "number" } },
        required: ["signedObservedChangePerYear"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
