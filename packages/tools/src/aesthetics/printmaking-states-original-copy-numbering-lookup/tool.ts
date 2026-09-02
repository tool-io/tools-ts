import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
          "Print states reflect changes to a matrix; edition numbering and artist proofs are distinct provenance conventions.",
        reference: "Printmaking museum cataloging standards.",
        limitations:
          "A low edition number does not by itself prove earlier printing, superior quality or authenticity.",
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
      text: "Print states reflect changes to a matrix; edition numbering and artist proofs are distinct provenance conventions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/printmaking-states-original-copy-numbering-lookup",
  title: "Printmaking States Original Copy Numbering Lookup",
  description:
    "Bounded offline reference: Print states reflect changes to a matrix; edition numbering and artist proofs are distinct provenance conventions. Source: Printmaking museum cataloging standards. A low edition number does not by itself prove earlier printing, superior quality or authenticity. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
