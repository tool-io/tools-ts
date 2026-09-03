import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly addedFlourG: number;
  readonly addedWaterG: number;
  readonly starterMassG: number;
  readonly callerStarterWaterMassFraction: number;
}>;
export type Output = Readonly<{
  readonly totalFlourG: number;
  readonly totalWaterG: number;
  readonly starterInclusiveHydrationPercent: number;
}>;
const inputFields = [
  { id: "addedFlourG", label: "Added flour g", kind: "number" },
  { id: "addedWaterG", label: "Added water g", kind: "number" },
  { id: "starterMassG", label: "Starter mass g", kind: "number" },
  {
    id: "callerStarterWaterMassFraction",
    label: "Caller starter water mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.addedFlourG, "addedFlourG");
  nonnegative(input.addedWaterG, "addedWaterG");
  nonnegative(input.starterMassG, "starterMassG");
  fraction(
    input.callerStarterWaterMassFraction,
    "callerStarterWaterMassFraction",
  );
  const f = positive(
      input.addedFlourG +
        input.starterMassG * (1 - input.callerStarterWaterMassFraction),
      "total flour",
    ),
    w =
      input.addedWaterG +
      input.starterMassG * input.callerStarterWaterMassFraction;
  return {
    totalFlourG: f,
    totalWaterG: w,
    starterInclusiveHydrationPercent: (100 * w) / f,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  addedFlourG: 100,
  addedWaterG: 50,
  starterMassG: 60,
  callerStarterWaterMassFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  totalFlourG: 130,
  totalWaterG: 80,
  starterInclusiveHydrationPercent: 61.53846153846154,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/sourdough-hydration",
  title: "Cooking Sourdough Hydration Calculator",
  description:
    "Sourdough flour/water balance includes independently characterized starter water/flour, unlike simple already-total water/flour hydration; assumes starter contains only flour/water. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "totalFlourG", label: "Total flour g", kind: "number" },
    { id: "totalWaterG", label: "Total water g", kind: "number" },
    {
      id: "starterInclusiveHydrationPercent",
      label: "Starter inclusive hydration percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      addedFlourG: value.addedFlourG as number,
      addedWaterG: value.addedWaterG as number,
      starterMassG: value.starterMassG as number,
      callerStarterWaterMassFraction:
        value.callerStarterWaterMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
