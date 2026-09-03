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
  readonly observedRetainedStarterMassG: number;
  readonly callerFlourFeedPerStarterMass: number;
  readonly callerWaterFeedPerStarterMass: number;
  readonly independentStarterWaterFraction: number;
}>;
export type Output = Readonly<{
  readonly callerAddedFlourG: number;
  readonly callerAddedWaterG: number;
  readonly conditionalFedStarterHydrationPercent: number;
}>;
const inputFields = [
  {
    id: "observedRetainedStarterMassG",
    label: "Observed retained starter mass g",
    kind: "number",
  },
  {
    id: "callerFlourFeedPerStarterMass",
    label: "Caller flour feed per starter mass",
    kind: "number",
  },
  {
    id: "callerWaterFeedPerStarterMass",
    label: "Caller water feed per starter mass",
    kind: "number",
  },
  {
    id: "independentStarterWaterFraction",
    label: "Independent starter water fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedRetainedStarterMassG,
    "observedRetainedStarterMassG",
  );
  nonnegative(
    input.callerFlourFeedPerStarterMass,
    "callerFlourFeedPerStarterMass",
  );
  nonnegative(
    input.callerWaterFeedPerStarterMass,
    "callerWaterFeedPerStarterMass",
  );
  fraction(
    input.independentStarterWaterFraction,
    "independentStarterWaterFraction",
  );
  const flour =
      input.observedRetainedStarterMassG * input.callerFlourFeedPerStarterMass,
    water =
      input.observedRetainedStarterMassG * input.callerWaterFeedPerStarterMass,
    tf = positive(
      flour +
        input.observedRetainedStarterMassG *
          (1 - input.independentStarterWaterFraction),
      "total flour",
    );
  return {
    callerAddedFlourG: flour,
    callerAddedWaterG: water,
    conditionalFedStarterHydrationPercent:
      (100 *
        (water +
          input.observedRetainedStarterMassG *
            input.independentStarterWaterFraction)) /
      tf,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRetainedStarterMassG: 20,
  callerFlourFeedPerStarterMass: 2,
  callerWaterFeedPerStarterMass: 1,
  independentStarterWaterFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  callerAddedFlourG: 40,
  callerAddedWaterG: 20,
  conditionalFedStarterHydrationPercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/sourdough-starter-feed-ratio",
  title: "Cooking Sourdough Starter Feed Ratio Calculator",
  description:
    "Starter-feed inventory from caller starter:flour:water mass ratios and independent retained starter composition; not existing overall dough hydration or biological feeding frequency. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "callerAddedFlourG", label: "Caller added flour g", kind: "number" },
    { id: "callerAddedWaterG", label: "Caller added water g", kind: "number" },
    {
      id: "conditionalFedStarterHydrationPercent",
      label: "Conditional fed starter hydration percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRetainedStarterMassG:
        value.observedRetainedStarterMassG as number,
      callerFlourFeedPerStarterMass:
        value.callerFlourFeedPerStarterMass as number,
      callerWaterFeedPerStarterMass:
        value.callerWaterFeedPerStarterMass as number,
      independentStarterWaterFraction:
        value.independentStarterWaterFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
