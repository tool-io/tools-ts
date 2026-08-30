import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly inletTanMgNPerLiter: readonly number[];
  readonly outletTanMgNPerLiter: readonly number[];
  readonly flowsM3PerDay: readonly number[];
  readonly activeMediaAreaM2: number;
}>;
export type Output = Readonly<{
  readonly observedRemovalKgNPerDay: number;
  readonly observedArealRateGramsNPerM2Day: number;
}>;
const inputFields = [
  {
    id: "inletTanMgNPerLiter",
    label: "Inlet tan mg n per liter",
    kind: "numberList",
  },
  {
    id: "outletTanMgNPerLiter",
    label: "Outlet tan mg n per liter",
    kind: "numberList",
  },
  { id: "flowsM3PerDay", label: "Flows m3 per day", kind: "numberList" },
  { id: "activeMediaAreaM2", label: "Active media area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.activeMediaAreaM2, "activeMediaAreaM2");
  input.inletTanMgNPerLiter.forEach((v) =>
    nonnegative(v, "inletTanMgNPerLiter"),
  );
  input.outletTanMgNPerLiter.forEach((v) =>
    nonnegative(v, "outletTanMgNPerLiter"),
  );
  input.flowsM3PerDay.forEach((v) => nonnegative(v, "flowsM3PerDay"));
  aligned(
    input.inletTanMgNPerLiter,
    input.outletTanMgNPerLiter,
    "inletTanMgNPerLiter",
  );
  aligned(
    input.inletTanMgNPerLiter,
    input.flowsM3PerDay,
    "inletTanMgNPerLiter",
  );
  const observedRemovalKgNPerDay = input.inletTanMgNPerLiter.reduce(
    (s, v, i) =>
      s + ((v - input.outletTanMgNPerLiter[i]) * input.flowsM3PerDay[i]) / 1000,
    0,
  );
  return {
    observedRemovalKgNPerDay,
    observedArealRateGramsNPerM2Day:
      (1000 * observedRemovalKgNPerDay) / input.activeMediaAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inletTanMgNPerLiter: [2, 3],
  outletTanMgNPerLiter: [1, 1],
  flowsM3PerDay: [100, 50],
  activeMediaAreaM2: 1000,
} satisfies Input;
export const exampleOutput = {
  observedRemovalKgNPerDay: 0.2,
  observedArealRateGramsNPerM2Day: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/nitrification-rate",
  title: "Nitrification Rate",
  description:
    "Measure net TAN disappearance and active-area-normalized rate across parallel streams; negative net removal is preserved and TAN disappearance alone does not prove nitrification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRemovalKgNPerDay",
      label: "Observed removal kg n per day",
      kind: "number",
    },
    {
      id: "observedArealRateGramsNPerM2Day",
      label: "Observed areal rate grams n per m2 day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      inletTanMgNPerLiter: value.inletTanMgNPerLiter as readonly number[],
      outletTanMgNPerLiter: value.outletTanMgNPerLiter as readonly number[],
      flowsM3PerDay: value.flowsM3PerDay as readonly number[],
      activeMediaAreaM2: value.activeMediaAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
