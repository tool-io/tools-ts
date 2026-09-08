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
          "Back to the Future Part IIdepicts an imagined2015including hoverboards, video calls and wearable/display technologies.",
        reference: "Backto the Future Part II 1989.",
        limitations:
          "Selectively matching fiction to devices is not an independently preregistered forecast score; claim boundaries matter.",
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
      text: "Back to the Future Part IIdepicts an imagined2015including hoverboards, video calls and wearable/display technologies.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/back-to-the-future-two-2015-predictions-hit-miss-scorecard",
  title: "Back to the Future Two 2015 Predictions Hit Miss Scorecard",
  description:
    "Bounded offline reference: Back to the Future Part IIdepicts an imagined2015including hoverboards, video calls and wearable/display technologies. Source: Backto the Future Part II 1989. Selectively matching fiction to devices is not an independently preregistered forecast score; claim boundaries matter. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
