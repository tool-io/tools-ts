import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Shells scenario practice explores alternative energy/social pathways and distinguishes scenarios from forecasts or corporate investment promises.",
        reference: "Shellscenario methodology publications.",
        limitations:
          "No complete edition inventory, probabilities or investment recommendation.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Shells scenario practice explores alternative energy/social pathways and distinguishes scenarios from forecasts or corporate investment promises.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/shell-scenarios-energy-transition-sketches-series-detail",
  title: "Shell Scenarios Energy Transition Sketches Series Detail",
  description:
    "Bounded offline reference: Shells scenario practice explores alternative energy/social pathways and distinguishes scenarios from forecasts or corporate investment promises. Source: Shellscenario methodology publications. No complete edition inventory, probabilities or investment recommendation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
