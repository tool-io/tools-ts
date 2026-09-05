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
          "MIB provides coded underwriting information and consumer access/dispute processes; a code is not a diagnosis or full medical file.",
        reference: "MIB, consumer disclosure guidance.",
        limitations:
          "Current rights and procedures require verified applicable terms; no private codes or health identity inferred.",
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
      text: "MIB provides coded underwriting information and consumer access/dispute processes; a code is not a diagnosis or full medical file.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/mib-medical-information-bureau-codes-disclosure-rights",
  title: "MIB Medical Information Bureau Codes Disclosure Rights",
  description:
    "Bounded offline reference: MIB provides coded underwriting information and consumer access/dispute processes; a code is not a diagnosis or full medical file. Source: MIB, consumer disclosure guidance. Current rights and procedures require verified applicable terms; no private codes or health identity inferred. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
