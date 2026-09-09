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
          "UKGovernment Office for Science Foresight projects use evidence and futures methods to examine long-term policy challenges.",
        reference:
          "UKGovernment Office for Science Foresight programme descriptions.",
        limitations:
          "The institutional title is corrected; specific project status requires dated verification.",
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
      text: "UKGovernment Office for Science Foresight projects use evidence and futures methods to examine long-term policy challenges.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/uk-government-office-for-foresight-programme-structure",
  title: "UK Government Office For Foresight Programme Structure",
  description:
    "Bounded offline reference: UKGovernment Office for Science Foresight projects use evidence and futures methods to examine long-term policy challenges. Source: UKGovernment Office for Science Foresight programme descriptions. The institutional title is corrected; specific project status requires dated verification. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
