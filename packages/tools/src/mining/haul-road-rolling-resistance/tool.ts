import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSteadyTowForcesN: readonly number[];
  readonly observedTruckNormalLoadsN: readonly number[];
  readonly observedIndependentGradeForcesN: readonly number[];
  readonly observedIndependentDragForcesN: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredObservedRollingResistanceFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSteadyTowForcesN",
    label: "Observed steady tow forces n",
    kind: "numberList",
  },
  {
    id: "observedTruckNormalLoadsN",
    label: "Observed truck normal loads n",
    kind: "numberList",
  },
  {
    id: "observedIndependentGradeForcesN",
    label: "Observed independent grade forces n",
    kind: "numberList",
  },
  {
    id: "observedIndependentDragForcesN",
    label: "Observed independent drag forces n",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTruckNormalLoadsN.forEach((v) =>
    positive(v, "observedTruckNormalLoadsN"),
  );
  input.observedSteadyTowForcesN.forEach((v) =>
    nonnegative(v, "observedSteadyTowForcesN"),
  );
  input.observedIndependentDragForcesN.forEach((v) =>
    nonnegative(v, "observedIndependentDragForcesN"),
  );
  aligned(
    input.observedSteadyTowForcesN,
    input.observedTruckNormalLoadsN,
    "observedSteadyTowForcesN",
  );
  aligned(
    input.observedSteadyTowForcesN,
    input.observedIndependentGradeForcesN,
    "observedSteadyTowForcesN",
  );
  aligned(
    input.observedSteadyTowForcesN,
    input.observedIndependentDragForcesN,
    "observedSteadyTowForcesN",
  );
  return {
    inferredObservedRollingResistanceFractions:
      input.observedSteadyTowForcesN.map(
        (v, i) =>
          (v -
            input.observedIndependentGradeForcesN[i] -
            input.observedIndependentDragForcesN[i]) /
          input.observedTruckNormalLoadsN[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteadyTowForcesN: [100, 200],
  observedTruckNormalLoadsN: [1000, 2000],
  observedIndependentGradeForcesN: [20, 50],
  observedIndependentDragForcesN: [10, 10],
} satisfies Input;
export const exampleOutput = {
  inferredObservedRollingResistanceFractions: [0.07, 0.07],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/haul-road-rolling-resistance",
  title: "Haul Road Rolling Resistance Calculator",
  description:
    "Infer actual steady towing rolling resistance after independent signed grade and aerodynamic force subtraction, not nominal coefficient×weight forecast or traction instructions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredObservedRollingResistanceFractions",
      label: "Inferred observed rolling resistance fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSteadyTowForcesN:
        value.observedSteadyTowForcesN as readonly number[],
      observedTruckNormalLoadsN:
        value.observedTruckNormalLoadsN as readonly number[],
      observedIndependentGradeForcesN:
        value.observedIndependentGradeForcesN as readonly number[],
      observedIndependentDragForcesN:
        value.observedIndependentDragForcesN as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
