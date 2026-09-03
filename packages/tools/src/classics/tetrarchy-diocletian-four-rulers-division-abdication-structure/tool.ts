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
          "Diocletian's tetrarchy structured two Augusti and two Caesars, with major establishment in 293 CE and abdications in 305 CE.",
        reference: "Lactantius; late Roman imperial scholarship.",
        limitations:
          "Roles and territorial arrangements changed; not a permanent equal four-way map.",
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
      text: "Diocletian's tetrarchy structured two Augusti and two Caesars, with major establishment in 293 CE and abdications in 305 CE.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/tetrarchy-diocletian-four-rulers-division-abdication-structure",
  title: "Tetrarchy Diocletian Four Rulers Division Abdication Structure",
  description:
    "Bounded offline reference: Diocletian's tetrarchy structured two Augusti and two Caesars, with major establishment in 293 CE and abdications in 305 CE. Source: Lactantius; late Roman imperial scholarship. Roles and territorial arrangements changed; not a permanent equal four-way map. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
