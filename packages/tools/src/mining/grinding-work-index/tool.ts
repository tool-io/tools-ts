import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGrindingTestEnergyKwhT: readonly number[];
  readonly callerMatchedGrindingTestWorkIndex: readonly number[];
  readonly queryGrindingTestEnergyKwhT: number;
}>;
export type Output = Readonly<{
  readonly interpolatedGrindingTestWorkIndex: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "observedGrindingTestEnergyKwhT",
    label: "Observed grinding test energy kwh t",
    kind: "numberList",
  },
  {
    id: "callerMatchedGrindingTestWorkIndex",
    label: "Caller matched grinding test work index",
    kind: "numberList",
  },
  {
    id: "queryGrindingTestEnergyKwhT",
    label: "Query grinding test energy kwh t",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGrindingTestEnergyKwhT.forEach((v) =>
    positive(v, "observedGrindingTestEnergyKwhT"),
  );
  positive(input.queryGrindingTestEnergyKwhT, "queryGrindingTestEnergyKwhT");
  input.callerMatchedGrindingTestWorkIndex.forEach((v) =>
    positive(v, "callerMatchedGrindingTestWorkIndex"),
  );
  const v = curve(
    input.observedGrindingTestEnergyKwhT,
    input.callerMatchedGrindingTestWorkIndex,
    input.queryGrindingTestEnergyKwhT,
  );
  return {
    interpolatedGrindingTestWorkIndex: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGrindingTestEnergyKwhT: [1, 2, 3],
  callerMatchedGrindingTestWorkIndex: [2, 4, 8],
  queryGrindingTestEnergyKwhT: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedGrindingTestWorkIndex: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/grinding-work-index",
  title: "Grinding Work Index Calculator",
  description:
    "Read independently protocol-specific GrindingTest energy/work-index calibration rather than copying ball/rod Bond laboratory correlations. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedGrindingTestWorkIndex",
      label: "Interpolated grinding test work index",
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
      observedGrindingTestEnergyKwhT:
        value.observedGrindingTestEnergyKwhT as readonly number[],
      callerMatchedGrindingTestWorkIndex:
        value.callerMatchedGrindingTestWorkIndex as readonly number[],
      queryGrindingTestEnergyKwhT: value.queryGrindingTestEnergyKwhT as number,
    }),
});
export const run = tool.execute;
export default tool;
