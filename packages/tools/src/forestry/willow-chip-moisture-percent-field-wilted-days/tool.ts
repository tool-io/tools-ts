import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  crossings,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWiltDays: readonly number[];
  readonly observedWillowChipWetBasisMoistureFractions: readonly number[];
  readonly callerTargetWetBasisMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly observedWiltTargetCrossingDays: readonly number[];
}>;
const inputFields = [
  { id: "observedWiltDays", label: "Observed wilt days", kind: "numberList" },
  {
    id: "observedWillowChipWetBasisMoistureFractions",
    label: "Observed willow chip wet basis moisture fractions",
    kind: "numberList",
  },
  {
    id: "callerTargetWetBasisMoistureFraction",
    label: "Caller target wet basis moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWiltDays.forEach((v) => nonnegative(v, "observedWiltDays"));
  input.observedWillowChipWetBasisMoistureFractions.forEach((v) =>
    fraction(v, "observedWillowChipWetBasisMoistureFractions"),
  );
  fraction(
    input.callerTargetWetBasisMoistureFraction,
    "callerTargetWetBasisMoistureFraction",
  );
  return {
    observedWiltTargetCrossingDays: crossings(
      input.observedWiltDays,
      input.observedWillowChipWetBasisMoistureFractions,
      input.callerTargetWetBasisMoistureFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWiltDays: [0, 2, 4],
  observedWillowChipWetBasisMoistureFractions: [0.6, 0.4, 0.2],
  callerTargetWetBasisMoistureFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedWiltTargetCrossingDays: [3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/willow-chip-moisture-percent-field-wilted-days",
  title: "Willow Chip Moisture Field-Wilt Days Calculator",
  description:
    "Extract actual field-wilt observed wet-basis chip moisture target crossings, all witnesses/no crossing retained; no drying weather prediction, prescribed wait or dry-basis substitution. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWiltTargetCrossingDays",
      label: "Observed wilt target crossing days",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWiltDays: value.observedWiltDays as readonly number[],
      observedWillowChipWetBasisMoistureFractions:
        value.observedWillowChipWetBasisMoistureFractions as readonly number[],
      callerTargetWetBasisMoistureFraction:
        value.callerTargetWetBasisMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
