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
          "He Jiankuis announced 2018 heritable genome-editing births prompted broad condemnation and governance debate over consent, safety and germline editing.",
        reference:
          "WHO human-genome-editing governance reports;2018 summit statements.",
        limitations:
          "No universal worldwide moratorium is inferred, no editing methods or clinical recommendation.",
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
      text: "He Jiankuis announced 2018 heritable genome-editing births prompted broad condemnation and governance debate over consent, safety and germline editing.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/he-jiankui-crispr-babies-2018-moratorium-aftermath-lookup",
  title: "He Jiankui Crispr Babies 2018 Moratorium Aftermath Lookup",
  description:
    "Bounded offline reference: He Jiankuis announced 2018 heritable genome-editing births prompted broad condemnation and governance debate over consent, safety and germline editing. Source: WHO human-genome-editing governance reports;2018 summit statements. No universal worldwide moratorium is inferred, no editing methods or clinical recommendation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
