import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique, pick } from "../batch44-shared.js";

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
          "John Henry ballads portray a steel-driving contest with a machine and the workers death; historical identifications are debated.",
        reference: "Nelson, Steel Drivin Man; American ballad collections.",
        limitations:
          "Ballad plot is not proof of a unique tunnel, person or exact contest.",
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
      text: "John Henry ballads portray a steel-driving contest with a machine and the workers death; historical identifications are debated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/john-henry-steel-driver-machine-contest-ballad-history",
  title: "John Henry Steel Driver Machine Contest Ballad History",
  description:
    "Bounded offline reference: John Henry ballads portray a steel-driving contest with a machine and the workers death; historical identifications are debated. Source: Nelson, Steel Drivin Man; American ballad collections. Ballad plot is not proof of a unique tunnel, person or exact contest. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
