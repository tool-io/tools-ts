import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly cycleBathVolumesLiters: readonly number[];
  readonly cycleChlorideMgPerLiter: readonly number[];
  readonly blankChlorideMgPerLiter: readonly number[];
  readonly callerEndpointMgPerLiter: number;
  readonly requiredConsecutiveEndpointCycles: number;
}>;
export type Output = Readonly<{
  readonly cycleRemovedChlorideMg: readonly number[];
  readonly totalMeasuredRemovedChlorideMg: number;
  readonly firstCallerEndpointCycle: number;
  readonly callerEndpointObserved: boolean;
}>;
const inputFields = [
  {
    id: "cycleBathVolumesLiters",
    label: "Cycle bath volumes liters",
    kind: "numberList",
  },
  {
    id: "cycleChlorideMgPerLiter",
    label: "Cycle chloride mg per liter",
    kind: "numberList",
  },
  {
    id: "blankChlorideMgPerLiter",
    label: "Blank chloride mg per liter",
    kind: "numberList",
  },
  {
    id: "callerEndpointMgPerLiter",
    label: "Caller endpoint mg per liter",
    kind: "number",
  },
  {
    id: "requiredConsecutiveEndpointCycles",
    label: "Required consecutive endpoint cycles",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cycleBathVolumesLiters.forEach((v) =>
    positive(v, "cycleBathVolumesLiters"),
  );
  positive(
    input.requiredConsecutiveEndpointCycles,
    "requiredConsecutiveEndpointCycles",
  );
  input.cycleChlorideMgPerLiter.forEach((v) =>
    nonnegative(v, "cycleChlorideMgPerLiter"),
  );
  input.blankChlorideMgPerLiter.forEach((v) =>
    nonnegative(v, "blankChlorideMgPerLiter"),
  );
  nonnegative(input.callerEndpointMgPerLiter, "callerEndpointMgPerLiter");
  count(
    input.requiredConsecutiveEndpointCycles,
    "requiredConsecutiveEndpointCycles",
  );
  aligned(
    input.cycleBathVolumesLiters,
    input.cycleChlorideMgPerLiter,
    "cycleBathVolumesLiters",
  );
  aligned(
    input.cycleBathVolumesLiters,
    input.blankChlorideMgPerLiter,
    "cycleBathVolumesLiters",
  );
  const cycleRemovedChlorideMg = input.cycleBathVolumesLiters.map(
    (v, i) =>
      v * (input.cycleChlorideMgPerLiter[i] - input.blankChlorideMgPerLiter[i]),
  );
  let streak = 0,
    firstCallerEndpointCycle = 0;
  input.cycleChlorideMgPerLiter.forEach((v, i) => {
    streak =
      v - input.blankChlorideMgPerLiter[i] <= input.callerEndpointMgPerLiter
        ? streak + 1
        : 0;
    if (
      firstCallerEndpointCycle === 0 &&
      streak >= input.requiredConsecutiveEndpointCycles
    )
      firstCallerEndpointCycle = i + 1;
  });
  return {
    cycleRemovedChlorideMg,
    totalMeasuredRemovedChlorideMg: cycleRemovedChlorideMg.reduce(
      (a, b) => a + b,
      0,
    ),
    firstCallerEndpointCycle,
    callerEndpointObserved: firstCallerEndpointCycle > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cycleBathVolumesLiters: [1, 2, 1],
  cycleChlorideMgPerLiter: [100, 20, 5],
  blankChlorideMgPerLiter: [10, 10, 10],
  callerEndpointMgPerLiter: 10,
  requiredConsecutiveEndpointCycles: 2,
} satisfies Input;
export const exampleOutput = {
  cycleRemovedChlorideMg: [90, 20, -5],
  totalMeasuredRemovedChlorideMg: 105,
  firstCallerEndpointCycle: 3,
  callerEndpointObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/artifact-conservation-desalination-cycle",
  title: "Artifact Desalination Cycle Counter",
  description:
    "Audit measured bath chloride mass and consecutive caller endpoint policy, retaining signed blank corrections and zero sentinel for no observed endpoint; not artifact corrosion stability or a desalination recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "cycleRemovedChlorideMg",
      label: "Cycle removed chloride mg",
      kind: "numberList",
    },
    {
      id: "totalMeasuredRemovedChlorideMg",
      label: "Total measured removed chloride mg",
      kind: "number",
    },
    {
      id: "firstCallerEndpointCycle",
      label: "First caller endpoint cycle",
      kind: "number",
    },
    {
      id: "callerEndpointObserved",
      label: "Caller endpoint observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      cycleBathVolumesLiters: value.cycleBathVolumesLiters as readonly number[],
      cycleChlorideMgPerLiter:
        value.cycleChlorideMgPerLiter as readonly number[],
      blankChlorideMgPerLiter:
        value.blankChlorideMgPerLiter as readonly number[],
      callerEndpointMgPerLiter: value.callerEndpointMgPerLiter as number,
      requiredConsecutiveEndpointCycles:
        value.requiredConsecutiveEndpointCycles as number,
    }),
});
export const run = tool.execute;
export default tool;
