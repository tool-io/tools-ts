import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Toga virilis denotes the adult male civic toga; praetexta has a purple border; candida is a specially whitened toga associated with candidates.",
        reference: "Varro, De lingua Latina; ancient dress terminology.",
        limitations:
          "Wearer status, era and ceremonial exceptions require context; no identity inferred from clothing alone.",
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
      text: "Toga virilis denotes the adult male civic toga; praetexta has a purple border; candida is a specially whitened toga associated with candidates.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/toga-types-virilis-praetexta-candida-lookup",
  title: "Toga Types Virilis Praetexta Candida Lookup",
  description:
    "Offline bounded reference card: Toga virilis denotes the adult male civic toga; praetexta has a purple border; candida is a specially whitened toga associated with candidates. References Varro, De lingua Latina; ancient dress terminology. Wearer status, era and ceremonial exceptions require context; no identity inferred from clothing alone.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
