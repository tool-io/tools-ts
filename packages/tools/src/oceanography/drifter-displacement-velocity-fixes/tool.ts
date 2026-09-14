import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly eastFixesM: readonly number[];
  readonly northFixesM: readonly number[];
  readonly timesSeconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eastFixesM", label: "East fixes m", kind: "numberList" },
  { id: "northFixesM", label: "North fixes m", kind: "numberList" },
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  aligned(i.eastFixesM, i.northFixesM, "fixes");
  aligned(i.eastFixesM, i.timesSeconds, "fixes");
  strictlyIncreasing(i.timesSeconds, "time", 2);
  const dt = i.timesSeconds.slice(1).map((v, j) => v - i.timesSeconds[j]);
  return {
    eastVelocitiesMPerS: dt.map(
      (t, j) => (i.eastFixesM[j + 1] - i.eastFixesM[j]) / t,
    ),
    northVelocitiesMPerS: dt.map(
      (t, j) => (i.northFixesM[j + 1] - i.northFixesM[j]) / t,
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    eastFixesM: [0, 10, 0],
    northFixesM: [0, 0, 10],
    timesSeconds: [0, 10, 20],
  },
  output: {
    result: { eastVelocitiesMPerS: [1, -1], northVelocitiesMPerS: [0, 1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/drifter-displacement-velocity-fixes",
  title: "Drifter Displacement Velocity Fixes Calculator",
  description:
    "Signed segment velocities from actual common planar drifter fixes/time; not geodetic conversion or future trajectory.",
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
