import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSubsidenceStationsM: readonly number[];
  readonly observedDownwardPositiveSubsidenceM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedInteriorSubsidenceCurvaturePerM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSubsidenceStationsM",
    label: "Observed subsidence stations m",
    kind: "numberList",
  },
  {
    id: "observedDownwardPositiveSubsidenceM",
    label: "Observed downward positive subsidence m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSubsidenceStationsM,
    input.observedDownwardPositiveSubsidenceM,
    "survey",
  );
  strictlyIncreasing(input.observedSubsidenceStationsM, "stations", 3);
  return {
    observedInteriorSubsidenceCurvaturePerM: input.observedSubsidenceStationsM
      .slice(1, -1)
      .map((x, i) => {
        const a = input.observedSubsidenceStationsM[i],
          b = input.observedSubsidenceStationsM[i + 2],
          y = input.observedDownwardPositiveSubsidenceM;
        return (
          (2 *
            ((y[i + 2] - y[i + 1]) / (b - x) - (y[i + 1] - y[i]) / (x - a))) /
          (b - a)
        );
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSubsidenceStationsM: [0, 1, 3],
  observedDownwardPositiveSubsidenceM: [0, 1, 9],
} satisfies Input;
export const exampleOutput = {
  observedInteriorSubsidenceCurvaturePerM: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/subsidence-curvature",
  title: "Subsidence Curvature Calculator",
  description:
    "Differentiate actual unequal-grid downward-positive subsidence survey twice, not analytic caller Gaussian tilt/strain or building-damage prediction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedInteriorSubsidenceCurvaturePerM",
      label: "Observed interior subsidence curvature per m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSubsidenceStationsM:
        value.observedSubsidenceStationsM as readonly number[],
      observedDownwardPositiveSubsidenceM:
        value.observedDownwardPositiveSubsidenceM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
