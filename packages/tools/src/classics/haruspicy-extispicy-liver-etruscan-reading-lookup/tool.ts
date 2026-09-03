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
          "Haruspicy interpreted entrails in traditions associated with Etruscan expertise; extispicy specifically concerns inspecting sacrificial organs.",
        reference:
          "Cicero, De divinatione; Piacenza liver archaeological object.",
        limitations:
          "No efficacy claim, ritual instructions or animal-harm guidance.",
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
      text: "Haruspicy interpreted entrails in traditions associated with Etruscan expertise; extispicy specifically concerns inspecting sacrificial organs.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/haruspicy-extispicy-liver-etruscan-reading-lookup",
  title: "Haruspicy Extispicy Liver Etruscan Reading Lookup",
  description:
    "Offline bounded reference card: Haruspicy interpreted entrails in traditions associated with Etruscan expertise; extispicy specifically concerns inspecting sacrificial organs. References Cicero, De divinatione; Piacenza liver archaeological object. No efficacy claim, ritual instructions or animal-harm guidance.",
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
