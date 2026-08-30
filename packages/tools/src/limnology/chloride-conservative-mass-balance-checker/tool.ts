import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly inflowM3PerDay: readonly number[];
  readonly inflowChlorideMgPerLiter: readonly number[];
  readonly outflowM3PerDay: readonly number[];
  readonly outflowChlorideMgPerLiter: readonly number[];
  readonly initialChlorideInventoryKg: number;
  readonly observedFinalChlorideInventoryKg: number;
  readonly closureToleranceKg: number;
}>;
export type Output = Readonly<{
  readonly integratedImportedChlorideKg: number;
  readonly integratedExportedChlorideKg: number;
  readonly predictedFinalChlorideInventoryKg: number;
  readonly observedMinusPredictedResidualKg: number;
  readonly withinClosureTolerance: boolean;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  { id: "inflowM3PerDay", label: "Inflow m3 per day", kind: "numberList" },
  {
    id: "inflowChlorideMgPerLiter",
    label: "Inflow chloride mg per liter",
    kind: "numberList",
  },
  { id: "outflowM3PerDay", label: "Outflow m3 per day", kind: "numberList" },
  {
    id: "outflowChlorideMgPerLiter",
    label: "Outflow chloride mg per liter",
    kind: "numberList",
  },
  {
    id: "initialChlorideInventoryKg",
    label: "Initial chloride inventory kg",
    kind: "number",
  },
  {
    id: "observedFinalChlorideInventoryKg",
    label: "Observed final chloride inventory kg",
    kind: "number",
  },
  { id: "closureToleranceKg", label: "Closure tolerance kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.inflowM3PerDay.forEach((v) => nonnegative(v, "inflowM3PerDay"));
  input.inflowChlorideMgPerLiter.forEach((v) =>
    nonnegative(v, "inflowChlorideMgPerLiter"),
  );
  input.outflowM3PerDay.forEach((v) => nonnegative(v, "outflowM3PerDay"));
  input.outflowChlorideMgPerLiter.forEach((v) =>
    nonnegative(v, "outflowChlorideMgPerLiter"),
  );
  nonnegative(input.initialChlorideInventoryKg, "initialChlorideInventoryKg");
  nonnegative(
    input.observedFinalChlorideInventoryKg,
    "observedFinalChlorideInventoryKg",
  );
  nonnegative(input.closureToleranceKg, "closureToleranceKg");
  aligned(input.timesDays, input.inflowM3PerDay, "timesDays");
  aligned(input.timesDays, input.inflowChlorideMgPerLiter, "timesDays");
  aligned(input.timesDays, input.outflowM3PerDay, "timesDays");
  aligned(input.timesDays, input.outflowChlorideMgPerLiter, "timesDays");
  const imported = input.inflowM3PerDay.map(
      (q, i) => (q * input.inflowChlorideMgPerLiter[i]) / 1000,
    ),
    exported = input.outflowM3PerDay.map(
      (q, i) => (q * input.outflowChlorideMgPerLiter[i]) / 1000,
    ),
    integratedImportedChlorideKg = integral(input.timesDays, imported),
    integratedExportedChlorideKg = integral(input.timesDays, exported),
    predictedFinalChlorideInventoryKg = nonnegative(
      input.initialChlorideInventoryKg +
        integratedImportedChlorideKg -
        integratedExportedChlorideKg,
      "outflowChlorideMgPerLiter",
    ),
    observedMinusPredictedResidualKg =
      input.observedFinalChlorideInventoryKg -
      predictedFinalChlorideInventoryKg;
  return {
    integratedImportedChlorideKg,
    integratedExportedChlorideKg,
    predictedFinalChlorideInventoryKg,
    observedMinusPredictedResidualKg,
    withinClosureTolerance:
      Math.abs(observedMinusPredictedResidualKg) <= input.closureToleranceKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  inflowM3PerDay: [10, 10, 10],
  inflowChlorideMgPerLiter: [100, 100, 100],
  outflowM3PerDay: [5, 5, 5],
  outflowChlorideMgPerLiter: [200, 200, 200],
  initialChlorideInventoryKg: 10,
  observedFinalChlorideInventoryKg: 11,
  closureToleranceKg: 0.1,
} satisfies Input;
export const exampleOutput = {
  integratedImportedChlorideKg: 2,
  integratedExportedChlorideKg: 2,
  predictedFinalChlorideInventoryKg: 10,
  observedMinusPredictedResidualKg: 1,
  withinClosureTolerance: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/chloride-conservative-mass-balance-checker",
  title: "Chloride Conservative Mass Balance Checker",
  description:
    "Audit conservative dissolved chloride inventory with trapezoidal sampled mass-flux integration and independent final inventory; this tracer is not chlorine disinfectant, and groundwater/deposition inputs must be included externally.",
  inputs: inputFields,
  outputs: [
    {
      id: "integratedImportedChlorideKg",
      label: "Integrated imported chloride kg",
      kind: "number",
    },
    {
      id: "integratedExportedChlorideKg",
      label: "Integrated exported chloride kg",
      kind: "number",
    },
    {
      id: "predictedFinalChlorideInventoryKg",
      label: "Predicted final chloride inventory kg",
      kind: "number",
    },
    {
      id: "observedMinusPredictedResidualKg",
      label: "Observed minus predicted residual kg",
      kind: "number",
    },
    {
      id: "withinClosureTolerance",
      label: "Within closure tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      inflowM3PerDay: value.inflowM3PerDay as readonly number[],
      inflowChlorideMgPerLiter:
        value.inflowChlorideMgPerLiter as readonly number[],
      outflowM3PerDay: value.outflowM3PerDay as readonly number[],
      outflowChlorideMgPerLiter:
        value.outflowChlorideMgPerLiter as readonly number[],
      initialChlorideInventoryKg: value.initialChlorideInventoryKg as number,
      observedFinalChlorideInventoryKg:
        value.observedFinalChlorideInventoryKg as number,
      closureToleranceKg: value.closureToleranceKg as number,
    }),
});
export const run = tool.execute;
export default tool;
