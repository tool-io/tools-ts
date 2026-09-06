import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ordered } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedWestIndianOceanAnomalyC: number;
  readonly observedEastIndianOceanAnomalyC: number;
  readonly callerNegativePhaseUpperC: number;
  readonly callerPositivePhaseLowerC: number;
}>;
export type Output = Readonly<{
  readonly indianOceanDipoleGradientC: number;
  readonly callerDipolePhase: string;
}>;
const inputFields = [
  {
    id: "observedWestIndianOceanAnomalyC",
    label: "Observed west indian ocean anomaly c",
    kind: "number",
  },
  {
    id: "observedEastIndianOceanAnomalyC",
    label: "Observed east indian ocean anomaly c",
    kind: "number",
  },
  {
    id: "callerNegativePhaseUpperC",
    label: "Caller negative phase upper c",
    kind: "number",
  },
  {
    id: "callerPositivePhaseLowerC",
    label: "Caller positive phase lower c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.callerNegativePhaseUpperC, input.callerPositivePhaseLowerC);
  const d =
    input.observedWestIndianOceanAnomalyC -
    input.observedEastIndianOceanAnomalyC;
  return {
    indianOceanDipoleGradientC: d,
    callerDipolePhase:
      d > input.callerPositivePhaseLowerC
        ? "positive"
        : d < input.callerNegativePhaseUpperC
          ? "negative"
          : "neutral",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWestIndianOceanAnomalyC: 1,
  observedEastIndianOceanAnomalyC: 0.2,
  callerNegativePhaseUpperC: -0.4,
  callerPositivePhaseLowerC: 0.4,
} satisfies Input;
export const exampleOutput = {
  indianOceanDipoleGradientC: 0.8,
  callerDipolePhase: "positive",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/indian-ocean-dipole-gradient-classifier",
  title: "Indian Ocean Dipole Gradient Classifier",
  description:
    "Explicit west-minus-east same-period/baseline anomaly gradient and independently verified strict phase bounds, equality neutral; no live data/ENSO inference. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "indianOceanDipoleGradientC",
      label: "Indian ocean dipole gradient c",
      kind: "number",
    },
    { id: "callerDipolePhase", label: "Caller dipole phase", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      observedWestIndianOceanAnomalyC:
        value.observedWestIndianOceanAnomalyC as number,
      observedEastIndianOceanAnomalyC:
        value.observedEastIndianOceanAnomalyC as number,
      callerNegativePhaseUpperC: value.callerNegativePhaseUpperC as number,
      callerPositivePhaseLowerC: value.callerPositivePhaseLowerC as number,
    }),
});
export const run = tool.execute;
export default tool;
