import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDeliveredWetShotcreteKg: readonly number[];
  readonly observedDeliveredDryFractions: readonly number[];
  readonly observedCollectedReboundDryKg: readonly number[];
}>;
export type Output = Readonly<{ readonly observedDryReboundFraction: number }>;
const inputFields = [
  {
    id: "observedDeliveredWetShotcreteKg",
    label: "Observed delivered wet shotcrete kg",
    kind: "numberList",
  },
  {
    id: "observedDeliveredDryFractions",
    label: "Observed delivered dry fractions",
    kind: "numberList",
  },
  {
    id: "observedCollectedReboundDryKg",
    label: "Observed collected rebound dry kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDeliveredWetShotcreteKg.forEach((v) =>
    nonnegative(v, "observedDeliveredWetShotcreteKg"),
  );
  input.observedCollectedReboundDryKg.forEach((v) =>
    nonnegative(v, "observedCollectedReboundDryKg"),
  );
  input.observedDeliveredDryFractions.forEach((v) =>
    fraction(v, "observedDeliveredDryFractions"),
  );
  aligned(
    input.observedDeliveredWetShotcreteKg,
    input.observedDeliveredDryFractions,
    "observedDeliveredWetShotcreteKg",
  );
  aligned(
    input.observedDeliveredWetShotcreteKg,
    input.observedCollectedReboundDryKg,
    "observedDeliveredWetShotcreteKg",
  );
  const dry = input.observedDeliveredWetShotcreteKg.map(
    (v, i) => v * input.observedDeliveredDryFractions[i],
  );
  dry.forEach((v, i) => {
    if (input.observedCollectedReboundDryKg[i] > v)
      simpleError("rebound", "Collected dry rebound≤delivered dry mass.");
  });
  positive(sum(dry), "delivered dry");
  return {
    observedDryReboundFraction:
      sum(input.observedCollectedReboundDryKg) / sum(dry),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDeliveredWetShotcreteKg: [100, 200],
  observedDeliveredDryFractions: [0.5, 0.5],
  observedCollectedReboundDryKg: [5, 20],
} satisfies Input;
export const exampleOutput = {
  observedDryReboundFraction: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shotcrete-rebound-percentage",
  title: "Shotcrete Rebound Percentage Calculator",
  description:
    "Audit actually collected dry rebound versus moisture-corrected delivered shotcrete, not forward batch volume from assumed rebound fraction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDryReboundFraction",
      label: "Observed dry rebound fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDeliveredWetShotcreteKg:
        value.observedDeliveredWetShotcreteKg as readonly number[],
      observedDeliveredDryFractions:
        value.observedDeliveredDryFractions as readonly number[],
      observedCollectedReboundDryKg:
        value.observedCollectedReboundDryKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
