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
          "Finlands parliamentary Committee for the Future conducts futures-oriented deliberation and technology assessment, and considers government futures reports.",
        reference: "Parliament of Finland committee descriptions.",
        limitations:
          "Specific powers/membership/reports require edition-specific verification; not executive policy authority.",
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
      text: "Finlands parliamentary Committee for the Future conducts futures-oriented deliberation and technology assessment, and considers government futures reports.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/finland-committee-for-the-future-parliament-mandate-lookup",
  title: "Finland Committee For the Future Parliament Mandate Lookup",
  description:
    "Bounded offline reference: Finlands parliamentary Committee for the Future conducts futures-oriented deliberation and technology assessment, and considers government futures reports. Source: Parliament of Finland committee descriptions. Specific powers/membership/reports require edition-specific verification; not executive policy authority. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
