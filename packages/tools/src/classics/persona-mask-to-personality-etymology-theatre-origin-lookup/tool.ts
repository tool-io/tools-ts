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
          "Latin persona can denote theatrical mask or role and later a person/legal role; ultimate etymology is debated.",
        reference: "Latin lexical tradition; Oxford Latin Dictionary, persona.",
        limitations:
          "Not a proven derivation of modern personality theory or the folk etymology per-sonare.",
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
      text: "Latin persona can denote theatrical mask or role and later a person/legal role; ultimate etymology is debated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/persona-mask-to-personality-etymology-theatre-origin-lookup",
  title: "Persona Mask to Personality Etymology Theatre Origin Lookup",
  description:
    "Offline bounded reference card: Latin persona can denote theatrical mask or role and later a person/legal role; ultimate etymology is debated. References Latin lexical tradition; Oxford Latin Dictionary, persona. Not a proven derivation of modern personality theory or the folk etymology per-sonare.",
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
