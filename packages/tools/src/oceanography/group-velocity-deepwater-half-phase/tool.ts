import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly phaseSpeedMPerS: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "phaseSpeedMPerS", label: "Phase speed m per s", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.phaseSpeedMPerS, "phase");
  return { groupSpeedMPerS: i.phaseSpeedMPerS / 2 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { phaseSpeedMPerS: 10 },
  output: { result: { groupSpeedMPerS: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/group-velocity-deepwater-half-phase",
  title: "Group Velocity Deepwater Half Phase Calculator",
  description:
    "Linear deepwater gravity-wave group velocity half phase velocity; no general finite-depth factor.",
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
