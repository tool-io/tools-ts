import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedConsumedFuelKgM2: readonly number[];
  readonly callerMatchedHeatYieldKjKg: readonly number[];
  readonly callerCombustionCompletenessFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly modeledReleasedHeatKjM2: number }>;
const inputFields = [
  {
    id: "observedConsumedFuelKgM2",
    label: "Observed consumed fuel kg m2",
    kind: "numberList",
  },
  {
    id: "callerMatchedHeatYieldKjKg",
    label: "Caller matched heat yield kj kg",
    kind: "numberList",
  },
  {
    id: "callerCombustionCompletenessFractions",
    label: "Caller combustion completeness fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedConsumedFuelKgM2.forEach((v) =>
    nonnegative(v, "observedConsumedFuelKgM2"),
  );
  input.callerMatchedHeatYieldKjKg.forEach((v) =>
    nonnegative(v, "callerMatchedHeatYieldKjKg"),
  );
  input.callerCombustionCompletenessFractions.forEach((v) =>
    fraction(v, "callerCombustionCompletenessFractions"),
  );
  aligned(
    input.observedConsumedFuelKgM2,
    input.callerMatchedHeatYieldKjKg,
    "observedConsumedFuelKgM2",
  );
  aligned(
    input.observedConsumedFuelKgM2,
    input.callerCombustionCompletenessFractions,
    "observedConsumedFuelKgM2",
  );
  return {
    modeledReleasedHeatKjM2: sum(
      input.observedConsumedFuelKgM2.map(
        (v, i) =>
          v *
          input.callerMatchedHeatYieldKjKg[i] *
          input.callerCombustionCompletenessFractions[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConsumedFuelKgM2: [1, 2],
  callerMatchedHeatYieldKjKg: [100, 200],
  callerCombustionCompletenessFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = { modeledReleasedHeatKjM2: 300 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/heat-per-unit-area-frontal",
  title: "Heat Per Unit Area Frontal Calculator",
  description:
    "Inventory consumed fuel released heat per area with independently established class heat yields/completeness, not fireline heat rate or all standing fuel assumed burned. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledReleasedHeatKjM2",
      label: "Modeled released heat kj m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConsumedFuelKgM2:
        value.observedConsumedFuelKgM2 as readonly number[],
      callerMatchedHeatYieldKjKg:
        value.callerMatchedHeatYieldKjKg as readonly number[],
      callerCombustionCompletenessFractions:
        value.callerCombustionCompletenessFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
