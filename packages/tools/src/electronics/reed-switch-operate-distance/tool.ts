import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  monotone,
  crossing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly magnetDistancesMm: readonly number[];
  readonly calibratedAxialFieldMillitesla: readonly number[];
  readonly callerReedOperateFieldMillitesla: number;
}>;
export type Output = Readonly<{
  readonly bracketedOperateDistanceMm: number;
  readonly operateThresholdBracketed: boolean;
  readonly observedDistanceDomainMm: readonly number[];
}>;
const inputFields = [
  { id: "magnetDistancesMm", label: "Magnet distances mm", kind: "numberList" },
  {
    id: "calibratedAxialFieldMillitesla",
    label: "Calibrated axial field millitesla",
    kind: "numberList",
  },
  {
    id: "callerReedOperateFieldMillitesla",
    label: "Caller reed operate field millitesla",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerReedOperateFieldMillitesla,
    "callerReedOperateFieldMillitesla",
  );
  input.magnetDistancesMm.forEach((v) => nonnegative(v, "magnetDistancesMm"));
  input.calibratedAxialFieldMillitesla.forEach((v) =>
    nonnegative(v, "calibratedAxialFieldMillitesla"),
  );
  monotone(input.calibratedAxialFieldMillitesla, "down", "field");
  const c = crossing(
    input.magnetDistancesMm,
    input.calibratedAxialFieldMillitesla,
    input.callerReedOperateFieldMillitesla,
  );
  return {
    bracketedOperateDistanceMm: c.value,
    operateThresholdBracketed: c.found,
    observedDistanceDomainMm: [c.lowerBound, c.upperBound],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  magnetDistancesMm: [1, 2, 3],
  calibratedAxialFieldMillitesla: [9, 6, 3],
  callerReedOperateFieldMillitesla: 5,
} satisfies Input;
export const exampleOutput = {
  bracketedOperateDistanceMm: 2.3333333333333335,
  operateThresholdBracketed: true,
  observedDistanceDomainMm: [1, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/reed-switch-operate-distance",
  title: "Reed Switch Operate Distance Calculator",
  description:
    "Infer bracketed reed operate distance on caller calibrated axial magnetic field versus distance; absent crossing retains unknown zero sentinel, no universal magnet inverse-power law, release hysteresis or installation range guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "bracketedOperateDistanceMm",
      label: "Bracketed operate distance mm",
      kind: "number",
    },
    {
      id: "operateThresholdBracketed",
      label: "Operate threshold bracketed",
      kind: "boolean",
    },
    {
      id: "observedDistanceDomainMm",
      label: "Observed distance domain mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      magnetDistancesMm: value.magnetDistancesMm as readonly number[],
      calibratedAxialFieldMillitesla:
        value.calibratedAxialFieldMillitesla as readonly number[],
      callerReedOperateFieldMillitesla:
        value.callerReedOperateFieldMillitesla as number,
    }),
});
export const run = tool.execute;
export default tool;
