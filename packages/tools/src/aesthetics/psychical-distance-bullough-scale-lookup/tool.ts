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
          "Bulloughs psychical distance describes a relation to an object that brackets practical personal concerns without mere indifference.",
        reference: "Bullough, Psychical Distance as a Factor in Art 1912.",
        limitations:
          "No canonical numeric scale or optimal universal emotional detachment.",
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
      text: "Bulloughs psychical distance describes a relation to an object that brackets practical personal concerns without mere indifference.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/psychical-distance-bullough-scale-lookup",
  title: "Psychical Distance Bullough Scale Lookup",
  description:
    "Bounded offline reference: Bulloughs psychical distance describes a relation to an object that brackets practical personal concerns without mere indifference. Source: Bullough, Psychical Distance as a Factor in Art 1912. No canonical numeric scale or optimal universal emotional detachment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
