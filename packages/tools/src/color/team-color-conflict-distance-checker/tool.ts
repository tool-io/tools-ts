import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly colorALab: readonly number[];
  readonly colorBLab: readonly number[];
  readonly callerMinimumDeltaE76: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "colorALab", label: "Color a lab", kind: "numberList" },
  { id: "colorBLab", label: "Color b lab", kind: "numberList" },
  {
    id: "callerMinimumDeltaE76",
    label: "Caller minimum delta e76",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.colorALab.length !== 3 || i.colorBLab.length !== 3)
    simpleError("Lab", "Three actual same-white Lab coordinates.");
  nonnegative(i.callerMinimumDeltaE76, "threshold");
  const d = Math.hypot(...i.colorALab.map((v, j) => v - i.colorBLab[j]));
  return { deltaE76: d, callerConflictFlag: d < i.callerMinimumDeltaE76 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    colorALab: [50, 0, 0],
    colorBLab: [50, 3, 4],
    callerMinimumDeltaE76: 6,
  },
  output: { result: { deltaE76: 5, callerConflictFlag: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/team-color-conflict-distance-checker",
  title: "Team Color Conflict Distance Checker",
  description:
    "Same-white CIELAB Delta E76 separation screen; not color-vision accessibility or team-identity certification.",
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
