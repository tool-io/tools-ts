import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly dryRiceG: number;
  readonly addedWaterG: number;
  readonly independentRetainedRiceWaterG: number;
  readonly independentProcessWaterLossG: number;
}>;
export type Output = Readonly<{ readonly availableWaterPerDryRice: number }>;
const inputFields = [
  { id: "dryRiceG", label: "Dry rice g", kind: "number" },
  { id: "addedWaterG", label: "Added water g", kind: "number" },
  {
    id: "independentRetainedRiceWaterG",
    label: "Independent retained rice water g",
    kind: "number",
  },
  {
    id: "independentProcessWaterLossG",
    label: "Independent process water loss g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.dryRiceG, "dryRiceG");
  nonnegative(input.addedWaterG, "addedWaterG");
  nonnegative(
    input.independentRetainedRiceWaterG,
    "independentRetainedRiceWaterG",
  );
  nonnegative(
    input.independentProcessWaterLossG,
    "independentProcessWaterLossG",
  );
  const water = nonnegative(
    input.addedWaterG +
      input.independentRetainedRiceWaterG -
      input.independentProcessWaterLossG,
    "available water",
  );
  return { availableWaterPerDryRice: water / input.dryRiceG };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryRiceG: 100,
  addedWaterG: 200,
  independentRetainedRiceWaterG: 10,
  independentProcessWaterLossG: 50,
} satisfies Input;
export const exampleOutput = { availableWaterPerDryRice: 1.6 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/rice-water-ratio",
  title: "Cooking Rice Water Ratio Calculator",
  description:
    "Actual rice water balance including independently measured retained-rinse water and process loss, not fixed dry-rice recipe ratio. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableWaterPerDryRice",
      label: "Available water per dry rice",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dryRiceG: value.dryRiceG as number,
      addedWaterG: value.addedWaterG as number,
      independentRetainedRiceWaterG:
        value.independentRetainedRiceWaterG as number,
      independentProcessWaterLossG:
        value.independentProcessWaterLossG as number,
    }),
});
export const run = tool.execute;
export default tool;
