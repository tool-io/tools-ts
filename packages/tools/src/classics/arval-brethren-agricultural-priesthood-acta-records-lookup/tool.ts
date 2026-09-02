import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "The Arval Brethren were a Roman priestly college associated with Dea Dia, and surviving acta inscriptions document particular rites/meetings.",
        reference: "Arval acta inscriptions; Roman religion scholarship.",
        limitations:
          "Not a complete agricultural calendar, priestly census or proof all ritual details are recoverable.",
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
      text: "The Arval Brethren were a Roman priestly college associated with Dea Dia, and surviving acta inscriptions document particular rites/meetings.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/arval-brethren-agricultural-priesthood-acta-records-lookup",
  title: "Arval Brethren Agricultural Priesthood Acta Records Lookup",
  description:
    "Bounded offline reference: The Arval Brethren were a Roman priestly college associated with Dea Dia, and surviving acta inscriptions document particular rites/meetings. Source: Arval acta inscriptions; Roman religion scholarship. Not a complete agricultural calendar, priestly census or proof all ritual details are recoverable. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
