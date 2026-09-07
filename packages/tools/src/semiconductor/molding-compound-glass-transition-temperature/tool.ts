import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMoldingScanKelvin: readonly number[];
  readonly observedMoldingHeatCapacitySteps: readonly number[];
  readonly callerTransitionStepFraction: number;
}>;
export type Output = Readonly<{
  readonly measuredGlassTransitionCrossingsKelvin: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMoldingScanKelvin",
    label: "Observed molding scan kelvin",
    kind: "numberList",
  },
  {
    id: "observedMoldingHeatCapacitySteps",
    label: "Observed molding heat capacity steps",
    kind: "numberList",
  },
  {
    id: "callerTransitionStepFraction",
    label: "Caller transition step fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.callerTransitionStepFraction, "callerTransitionStepFraction");
  const lo = Math.min(...input.observedMoldingHeatCapacitySteps),
    hi = Math.max(...input.observedMoldingHeatCapacitySteps);
  if (hi === lo)
    simpleError(
      "step",
      "Nonzero independently baseline-corrected heat-capacity step required.",
    );
  return {
    measuredGlassTransitionCrossingsKelvin: crossings(
      input.observedMoldingScanKelvin,
      input.observedMoldingHeatCapacitySteps,
      lo + input.callerTransitionStepFraction * (hi - lo),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMoldingScanKelvin: [1, 2, 3, 4],
  observedMoldingHeatCapacitySteps: [0, 1, 3, 4],
  callerTransitionStepFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  measuredGlassTransitionCrossingsKelvin: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/molding-compound-glass-transition-temperature",
  title:
    "Semiconductor Molding Compound Glass Transition Temperature Calculator",
  description:
    "Extract caller-fraction actual molding compound baseline-corrected heat-capacity step transition, not universal Tg or heating/cure recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredGlassTransitionCrossingsKelvin",
      label: "Measured glass transition crossings kelvin",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMoldingScanKelvin:
        value.observedMoldingScanKelvin as readonly number[],
      observedMoldingHeatCapacitySteps:
        value.observedMoldingHeatCapacitySteps as readonly number[],
      callerTransitionStepFraction:
        value.callerTransitionStepFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
