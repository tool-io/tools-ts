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
          "Apodyterium is a changing space; tepidarium warm; caldarium hot; frigidarium cold.",
        reference: "Vitruvius, De architectura 5.10; excavated Roman baths.",
        limitations:
          "Not a mandatory visit sequence or safe temperature-exposure instruction.",
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
      text: "Apodyterium is a changing space; tepidarium warm; caldarium hot; frigidarium cold.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/baths-sequence-apodyterium-tepidarium-caldarium-frigidarium-lookup",
  title: "Baths Sequence Apodyterium Tepidarium Caldarium Frigidarium Lookup",
  description:
    "Offline bounded reference card: Apodyterium is a changing space; tepidarium warm; caldarium hot; frigidarium cold. References Vitruvius, De architectura 5.10; excavated Roman baths. Not a mandatory visit sequence or safe temperature-exposure instruction.",
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
