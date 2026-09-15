import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly convention: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "convention", label: "Convention", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.convention,
      {
        on1: "Common break steps on beats 1 and 5 in an eight-count phrase.",
        "new-york-on2":
          "Common break steps on beats 2 and 6; step/action details vary by teaching convention.",
      },
      "convention",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { convention: "on1" },
  output: {
    result: {
      reference:
        "Common break steps on beats 1 and 5 in an eight-count phrase.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/salsa-on1-on2-timing-convention-lookup",
  title: "Salsa On1/On2 Timing Convention Lookup",
  description:
    "Bounded common salsa timing notes, not all On2 variants or choreography inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
