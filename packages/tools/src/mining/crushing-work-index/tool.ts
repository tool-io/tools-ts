import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCrushingImpactEnergyKwhT: readonly number[];
  readonly callerMatchedCrushingImpactWorkIndex: readonly number[];
  readonly queryCrushingImpactEnergyKwhT: number;
}>;
export type Output = Readonly<{
  readonly interpolatedCrushingImpactWorkIndex: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "observedCrushingImpactEnergyKwhT",
    label: "Observed crushing impact energy kwh t",
    kind: "numberList",
  },
  {
    id: "callerMatchedCrushingImpactWorkIndex",
    label: "Caller matched crushing impact work index",
    kind: "numberList",
  },
  {
    id: "queryCrushingImpactEnergyKwhT",
    label: "Query crushing impact energy kwh t",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCrushingImpactEnergyKwhT.forEach((v) =>
    positive(v, "observedCrushingImpactEnergyKwhT"),
  );
  positive(
    input.queryCrushingImpactEnergyKwhT,
    "queryCrushingImpactEnergyKwhT",
  );
  input.callerMatchedCrushingImpactWorkIndex.forEach((v) =>
    positive(v, "callerMatchedCrushingImpactWorkIndex"),
  );
  const v = curve(
    input.observedCrushingImpactEnergyKwhT,
    input.callerMatchedCrushingImpactWorkIndex,
    input.queryCrushingImpactEnergyKwhT,
  );
  return {
    interpolatedCrushingImpactWorkIndex: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCrushingImpactEnergyKwhT: [1, 2, 3],
  callerMatchedCrushingImpactWorkIndex: [2, 4, 8],
  queryCrushingImpactEnergyKwhT: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedCrushingImpactWorkIndex: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/crushing-work-index",
  title: "Crushing Work Index Calculator",
  description:
    "Read independently protocol-specific CrushingImpact energy/work-index calibration rather than copying ball/rod Bond laboratory correlations. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedCrushingImpactWorkIndex",
      label: "Interpolated crushing impact work index",
      kind: "number",
    },
    {
      id: "localObservedSecantSlope",
      label: "Local observed secant slope",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCrushingImpactEnergyKwhT:
        value.observedCrushingImpactEnergyKwhT as readonly number[],
      callerMatchedCrushingImpactWorkIndex:
        value.callerMatchedCrushingImpactWorkIndex as readonly number[],
      queryCrushingImpactEnergyKwhT:
        value.queryCrushingImpactEnergyKwhT as number,
    }),
});
export const run = tool.execute;
export default tool;
