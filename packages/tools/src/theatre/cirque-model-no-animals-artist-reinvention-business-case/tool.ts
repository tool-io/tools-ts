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
          "Cirque du Soleils business/performance history is associated with human-centered circus and theatrical reinvention without animal acts.",
        reference: "Cirque corporate/performance histories.",
        limitations:
          "A case study does not prove one universal successful model or eliminate performer safety needs.",
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
      text: "Cirque du Soleils business/performance history is associated with human-centered circus and theatrical reinvention without animal acts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/cirque-model-no-animals-artist-reinvention-business-case",
  title: "Cirque Model No Animals Artist Reinvention Business Case",
  description:
    "Bounded offline reference: Cirque du Soleils business/performance history is associated with human-centered circus and theatrical reinvention without animal acts. Source: Cirque corporate/performance histories. A case study does not prove one universal successful model or eliminate performer safety needs. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
