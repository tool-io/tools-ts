import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly point: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "point", label: "Point", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.point,
      {
        L1: "Linearly unstable saddle-center-center equilibrium in the standard spatial CR3BP.",
        L2: "Linearly unstable saddle-center-center equilibrium in the standard spatial CR3BP.",
        L3: "Linearly unstable saddle-center-center equilibrium in the standard spatial CR3BP.",
      },
      "point",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { point: "L1" },
  output: {
    result: {
      reference:
        "Linearly unstable saddle-center-center equilibrium in the standard spatial CR3BP.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/collinear-stability-saddle-flag-checker",
  title: "Collinear Point Stability Saddle Classification Flag Checker",
  description:
    "Bounded standard CR3BP collinear-equilibrium classification, not controlled spacecraft stability or full nonlinear trajectory analysis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
