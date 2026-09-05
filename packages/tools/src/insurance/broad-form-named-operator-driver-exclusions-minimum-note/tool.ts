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
          "Named-operator/broad-form policies can limit protection by driver rather than insure all use of an identified vehicle.",
        reference: "Auto policy forms and state insurance guidance.",
        limitations:
          "Restrictions vary; minimum statutory limits do not prove every driver/vehicle is covered.",
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
      text: "Named-operator/broad-form policies can limit protection by driver rather than insure all use of an identified vehicle.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/broad-form-named-operator-driver-exclusions-minimum-note",
  title: "Broad Form Named Operator Driver Exclusions Minimum Note",
  description:
    "Bounded offline reference: Named-operator/broad-form policies can limit protection by driver rather than insure all use of an identified vehicle. Source: Auto policy forms and state insurance guidance. Restrictions vary; minimum statutory limits do not prove every driver/vehicle is covered. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
