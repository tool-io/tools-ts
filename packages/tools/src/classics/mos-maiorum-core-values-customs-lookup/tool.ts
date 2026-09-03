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
          "Mos maiorum refers to ancestral customs; commonly discussed virtues include pietas, fides, gravitas and virtus.",
        reference: "Cicero, De officiis; Roman moral vocabulary.",
        limitations:
          "No exhaustive official list, universal meaning or endorsement of exclusionary ancient norms.",
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
      text: "Mos maiorum refers to ancestral customs; commonly discussed virtues include pietas, fides, gravitas and virtus.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/mos-maiorum-core-values-customs-lookup",
  title: "Mos Maiorum Core Values Customs Lookup",
  description:
    "Offline bounded reference card: Mos maiorum refers to ancestral customs; commonly discussed virtues include pietas, fides, gravitas and virtus. References Cicero, De officiis; Roman moral vocabulary. No exhaustive official list, universal meaning or endorsement of exclusionary ancient norms.",
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
