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
          "The Library of Celsus at Ephesus includes a prominently reconstructed facade based on surviving evidence.",
        reference: "Ephesus archaeological excavation/conservation histories.",
        limitations:
          "Distinguish ancient fabric, reassembled elements and modern reconstruction; appearance does not prove every feature original.",
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
      text: "The Library of Celsus at Ephesus includes a prominently reconstructed facade based on surviving evidence.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/library-of-celsus-ephesus-facade-reconstruction-story",
  title: "Library of Celsus Ephesus Facade Reconstruction Story",
  description:
    "Bounded offline reference: The Library of Celsus at Ephesus includes a prominently reconstructed facade based on surviving evidence. Source: Ephesus archaeological excavation/conservation histories. Distinguish ancient fabric, reassembled elements and modern reconstruction; appearance does not prove every feature original. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
