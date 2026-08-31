import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  planckXY,
  uv,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly measuredXy: readonly number[];
  readonly callerReferenceKelvin: number;
}>;
export type Output = Readonly<{
  readonly signedLocalPlanckianDuv: number;
  readonly referenceCie1960Uv: readonly number[];
}>;
const inputFields = [
  { id: "measuredXy", label: "Measured xy", kind: "numberList" },
  {
    id: "callerReferenceKelvin",
    label: "Caller reference kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const measured = uv(input.measuredXy),
    reference = uv(planckXY(input.callerReferenceKelvin)),
    lo = uv(planckXY(Math.max(1667, input.callerReferenceKelvin - 1))),
    hi = uv(planckXY(Math.min(25000, input.callerReferenceKelvin + 1))),
    dx = hi[0] - lo[0],
    dy = hi[1] - lo[1],
    length = positive(Math.hypot(dx, dy), "tangent"),
    nx = dy / length,
    ny = -dx / length,
    sign = ny < 0 ? -1 : 1;
  return {
    signedLocalPlanckianDuv:
      sign *
      ((measured[0] - reference[0]) * nx + (measured[1] - reference[1]) * ny),
    referenceCie1960Uv: reference,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredXy: [0.3134941075102412, 0.32366253911989207],
  callerReferenceKelvin: 6500,
} satisfies Input;
export const exampleOutput = {
  signedLocalPlanckianDuv: 0,
  referenceCie1960Uv: [0.20041297662543764, 0.31037029723937803],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/planckian-track-duv-approximation",
  title: "Planckian Track Duv Approximation",
  description:
    "Approximate signed local CIE1960 uv normal displacement at explicitly supplied reference temperature, positive toward increasing v; not global nearest-locus CCT search or standards-grade Duv far from the reference tangent.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLocalPlanckianDuv",
      label: "Signed local planckian duv",
      kind: "number",
    },
    {
      id: "referenceCie1960Uv",
      label: "Reference cie1960 uv",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredXy: value.measuredXy as readonly number[],
      callerReferenceKelvin: value.callerReferenceKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
