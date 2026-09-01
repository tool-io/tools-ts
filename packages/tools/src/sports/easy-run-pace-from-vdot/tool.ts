import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  interpolate,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVdotKnots: readonly number[];
  readonly callerEasyPaceMinimumSecondsKm: readonly number[];
  readonly callerEasyPaceMaximumSecondsKm: readonly number[];
  readonly queryVdot: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedEasyPaceRangeSecondsKm: readonly number[];
}>;
const inputFields = [
  {
    id: "callerVerifiedVdotKnots",
    label: "Caller verified vdot knots",
    kind: "numberList",
  },
  {
    id: "callerEasyPaceMinimumSecondsKm",
    label: "Caller easy pace minimum seconds km",
    kind: "numberList",
  },
  {
    id: "callerEasyPaceMaximumSecondsKm",
    label: "Caller easy pace maximum seconds km",
    kind: "numberList",
  },
  { id: "queryVdot", label: "Query vdot", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedVdotKnots.forEach((v) =>
    positive(v, "callerVerifiedVdotKnots"),
  );
  input.callerEasyPaceMinimumSecondsKm.forEach((v) =>
    positive(v, "callerEasyPaceMinimumSecondsKm"),
  );
  input.callerEasyPaceMaximumSecondsKm.forEach((v) =>
    positive(v, "callerEasyPaceMaximumSecondsKm"),
  );
  positive(input.queryVdot, "queryVdot");
  aligned(
    input.callerVerifiedVdotKnots,
    input.callerEasyPaceMinimumSecondsKm,
    "callerVerifiedVdotKnots",
  );
  aligned(
    input.callerVerifiedVdotKnots,
    input.callerEasyPaceMaximumSecondsKm,
    "callerVerifiedVdotKnots",
  );
  input.callerEasyPaceMinimumSecondsKm.forEach((v, i) =>
    ordered(v, input.callerEasyPaceMaximumSecondsKm[i]),
  );
  return {
    callerInterpolatedEasyPaceRangeSecondsKm: [
      interpolate(
        input.callerVerifiedVdotKnots,
        input.callerEasyPaceMinimumSecondsKm,
        input.queryVdot,
      ),
      interpolate(
        input.callerVerifiedVdotKnots,
        input.callerEasyPaceMaximumSecondsKm,
        input.queryVdot,
      ),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVdotKnots: [30, 40, 50],
  callerEasyPaceMinimumSecondsKm: [450, 360, 300],
  callerEasyPaceMaximumSecondsKm: [510, 420, 360],
  queryVdot: 45,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedEasyPaceRangeSecondsKm: [330, 390],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/easy-run-pace-from-vdot",
  title: "Easy Run Pace From VDOT Lookup",
  description:
    "Interpolate caller verified VDOT-specific easy pace interval within supplied table; no invented Daniels edition or general speed-to-pace alias, not a training recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedEasyPaceRangeSecondsKm",
      label: "Caller interpolated easy pace range seconds km",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedVdotKnots:
        value.callerVerifiedVdotKnots as readonly number[],
      callerEasyPaceMinimumSecondsKm:
        value.callerEasyPaceMinimumSecondsKm as readonly number[],
      callerEasyPaceMaximumSecondsKm:
        value.callerEasyPaceMaximumSecondsKm as readonly number[],
      queryVdot: value.queryVdot as number,
    }),
});
export const run = tool.execute;
export default tool;
