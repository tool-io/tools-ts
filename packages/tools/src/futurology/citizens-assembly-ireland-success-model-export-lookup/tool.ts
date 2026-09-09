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
          "Irish citizens assemblies combine selected participants, expert evidence and deliberation with specific constitutional/political contexts.",
        reference: "Ireland Citizens' Assembly process reports.",
        limitations:
          "Institutional transplantation does not guarantee representative, safe or successful deliberation.",
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
      text: "Irish citizens assemblies combine selected participants, expert evidence and deliberation with specific constitutional/political contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/citizens-assembly-ireland-success-model-export-lookup",
  title: "Citizens Assembly Ireland Success Model Export Lookup",
  description:
    "Bounded offline reference: Irish citizens assemblies combine selected participants, expert evidence and deliberation with specific constitutional/political contexts. Source: Ireland Citizens' Assembly process reports. Institutional transplantation does not guarantee representative, safe or successful deliberation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
