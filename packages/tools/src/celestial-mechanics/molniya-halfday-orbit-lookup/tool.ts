import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly reference: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "reference", label: "Reference", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.reference,
      { "approximate-period-hours": 12 },
      "reference",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { reference: "approximate-period-hours" },
  output: { result: { reference: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/molniya-halfday-orbit-lookup",
  title: "Molniya Period Half-Day 12-Hour Orbit Reference Lookup",
  description:
    "Rounded half-sidereal-day Molniya orbital-period convention; exact period near 11h58m, no orbit design or ground track.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "number" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
