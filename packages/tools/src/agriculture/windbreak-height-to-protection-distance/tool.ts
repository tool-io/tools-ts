import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  crossings,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDownwindDistancesM: readonly number[];
  readonly observedWindReductionFractions: readonly number[];
  readonly observedWindbreakHeightM: number;
  readonly callerProtectionReductionFraction: number;
}>;
export type Output = Readonly<{
  readonly observedProtectionBoundaryDistancesM: readonly number[];
  readonly boundaryWindbreakHeightMultiples: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDownwindDistancesM",
    label: "Observed downwind distances m",
    kind: "numberList",
  },
  {
    id: "observedWindReductionFractions",
    label: "Observed wind reduction fractions",
    kind: "numberList",
  },
  {
    id: "observedWindbreakHeightM",
    label: "Observed windbreak height m",
    kind: "number",
  },
  {
    id: "callerProtectionReductionFraction",
    label: "Caller protection reduction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedWindbreakHeightM, "observedWindbreakHeightM");
  input.observedDownwindDistancesM.forEach((v) =>
    nonnegative(v, "observedDownwindDistancesM"),
  );
  input.observedWindReductionFractions.forEach((v) =>
    fraction(v, "observedWindReductionFractions"),
  );
  fraction(
    input.callerProtectionReductionFraction,
    "callerProtectionReductionFraction",
  );
  const points = crossings(
    input.observedDownwindDistancesM,
    input.observedWindReductionFractions,
    input.callerProtectionReductionFraction,
  );
  return {
    observedProtectionBoundaryDistancesM: points,
    boundaryWindbreakHeightMultiples: points.map(
      (v) => v / input.observedWindbreakHeightM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDownwindDistancesM: [0, 10, 20],
  observedWindReductionFractions: [0.8, 0.5, 0.1],
  observedWindbreakHeightM: 5,
  callerProtectionReductionFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  observedProtectionBoundaryDistancesM: [10],
  boundaryWindbreakHeightMultiples: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/windbreak-height-to-protection-distance",
  title: "Agriculture Windbreak Height To Protection Distance Calculator",
  description:
    "Find measured wind-reduction boundary crossings normalized by actual height, all crossings/missing witnesses retained, no universal height×protection heuristic. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedProtectionBoundaryDistancesM",
      label: "Observed protection boundary distances m",
      kind: "numberList",
    },
    {
      id: "boundaryWindbreakHeightMultiples",
      label: "Boundary windbreak height multiples",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDownwindDistancesM:
        value.observedDownwindDistancesM as readonly number[],
      observedWindReductionFractions:
        value.observedWindReductionFractions as readonly number[],
      observedWindbreakHeightM: value.observedWindbreakHeightM as number,
      callerProtectionReductionFraction:
        value.callerProtectionReductionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
