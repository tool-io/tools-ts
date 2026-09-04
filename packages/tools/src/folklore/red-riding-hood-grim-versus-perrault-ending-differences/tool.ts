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
          "Perraults Little Red Riding Hood ends without the familiar rescuer; Grimm's well-known later version includes rescue and a further episode.",
        reference: "Perrault, Le Petit Chaperon rouge; Grimm, KHM 26.",
        limitations:
          "Specify edition and text; modern adaptations should not be conflated with all oral variants.",
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
      text: "Perraults Little Red Riding Hood ends without the familiar rescuer; Grimm's well-known later version includes rescue and a further episode.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/red-riding-hood-grim-versus-perrault-ending-differences",
  title: "Red Riding Hood Grim Versus Perrault Ending Differences",
  description:
    "Bounded offline reference: Perraults Little Red Riding Hood ends without the familiar rescuer; Grimm's well-known later version includes rescue and a further episode. Source: Perrault, Le Petit Chaperon rouge; Grimm, KHM 26. Specify edition and text; modern adaptations should not be conflated with all oral variants. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
