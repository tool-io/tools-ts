import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualResidentCount: number;
  readonly actualHabitableRoomCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualResidentCount", label: "Actual resident count", kind: "number" },
  {
    id: "actualHabitableRoomCount",
    label: "Actual habit able room count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualResidentCount, "actualResidentCount", 0, 1000000);
  bounded(
    input.actualHabitableRoomCount,
    "actualHabitableRoomCount",
    1,
    1000000,
  );
  return {
    value: (1 * input.actualResidentCount) / input.actualHabitableRoomCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualResidentCount: 2, actualHabitableRoomCount: 4 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/crowding-index",
  title: "Crowding Index Calculator",
  description:
    "Actual crowding persons per habit able room. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
