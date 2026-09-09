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
          "Raworths doughnut places a social foundation inside an ecological ceiling, framing a safe and just space between them.",
        reference: "Raworth, Doughnut Economics 2017.",
        limitations:
          "No default local thresholds or proof measured sustainability; planetary-boundary downscaling needs explicit methodology.",
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
      text: "Raworths doughnut places a social foundation inside an ecological ceiling, framing a safe and just space between them.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/donut-economics-social-planetary-boundaries-ring-model",
  title: "Donut Economics Social Planetary Boundaries Ring Model",
  description:
    "Bounded offline reference: Raworths doughnut places a social foundation inside an ecological ceiling, framing a safe and just space between them. Source: Raworth, Doughnut Economics 2017. No default local thresholds or proof measured sustainability; planetary-boundary downscaling needs explicit methodology. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
