import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPreShakeMassG: number;
  readonly observedPostShakeLiquidMassG: number;
  readonly independentlyRemovedLiquidMassG: number;
}>;
export type Output = Readonly<{
  readonly conditionalAddedIceWaterG: number;
  readonly addedWaterPerInitialPercent: number;
}>;
const inputFields = [
  {
    id: "observedPreShakeMassG",
    label: "Observed pre shake mass g",
    kind: "number",
  },
  {
    id: "observedPostShakeLiquidMassG",
    label: "Observed post shake liquid mass g",
    kind: "number",
  },
  {
    id: "independentlyRemovedLiquidMassG",
    label: "Independently removed liquid mass g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedPreShakeMassG, "observedPreShakeMassG");
  nonnegative(
    input.observedPostShakeLiquidMassG,
    "observedPostShakeLiquidMassG",
  );
  nonnegative(
    input.independentlyRemovedLiquidMassG,
    "independentlyRemovedLiquidMassG",
  );
  const w = nonnegative(
    input.observedPostShakeLiquidMassG +
      input.independentlyRemovedLiquidMassG -
      input.observedPreShakeMassG,
    "meltwater gain",
  );
  return {
    conditionalAddedIceWaterG: w,
    addedWaterPerInitialPercent: (100 * w) / input.observedPreShakeMassG,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPreShakeMassG: 100,
  observedPostShakeLiquidMassG: 130,
  independentlyRemovedLiquidMassG: 10,
} satisfies Input;
export const exampleOutput = {
  conditionalAddedIceWaterG: 40,
  addedWaterPerInitialPercent: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/cocktail-dilution",
  title: "Cooking Cocktail Dilution Calculator",
  description:
    "Actual cocktail mass gain corrected for independently removed liquid, assumes ice is only added source; not ABV or cooling estimate. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalAddedIceWaterG",
      label: "Conditional added ice water g",
      kind: "number",
    },
    {
      id: "addedWaterPerInitialPercent",
      label: "Added water per initial percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPreShakeMassG: value.observedPreShakeMassG as number,
      observedPostShakeLiquidMassG:
        value.observedPostShakeLiquidMassG as number,
      independentlyRemovedLiquidMassG:
        value.independentlyRemovedLiquidMassG as number,
    }),
});
export const run = tool.execute;
export default tool;
