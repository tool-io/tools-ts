import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedInitialSauceMassG: number;
  readonly observedFinalSauceMassG: number;
  readonly independentlyRemovedNonVolatileMassG: number;
}>;
export type Output = Readonly<{
  readonly totalMassReductionPercent: number;
  readonly conditionalVolatileLossPercent: number;
}>;
const inputFields = [
  {
    id: "observedInitialSauceMassG",
    label: "Observed initial sauce mass g",
    kind: "number",
  },
  {
    id: "observedFinalSauceMassG",
    label: "Observed final sauce mass g",
    kind: "number",
  },
  {
    id: "independentlyRemovedNonVolatileMassG",
    label: "Independently removed non volatile mass g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedInitialSauceMassG, "observedInitialSauceMassG");
  nonnegative(input.observedFinalSauceMassG, "observedFinalSauceMassG");
  nonnegative(
    input.independentlyRemovedNonVolatileMassG,
    "independentlyRemovedNonVolatileMassG",
  );
  const loss = input.observedInitialSauceMassG - input.observedFinalSauceMassG,
    v = nonnegative(
      loss - input.independentlyRemovedNonVolatileMassG,
      "volatile loss",
    );
  return {
    totalMassReductionPercent: (100 * loss) / input.observedInitialSauceMassG,
    conditionalVolatileLossPercent: (100 * v) / input.observedInitialSauceMassG,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInitialSauceMassG: 100,
  observedFinalSauceMassG: 70,
  independentlyRemovedNonVolatileMassG: 10,
} satisfies Input;
export const exampleOutput = {
  totalMassReductionPercent: 30,
  conditionalVolatileLossPercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/sauce-reduction-percentage",
  title: "Cooking Sauce Reduction Percentage Calculator",
  description:
    "Actual sauce reduction distinguishes independently removed nonvolatile material from conditional volatile loss; no evaporation-duration or concentration inferred from volume alone. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalMassReductionPercent",
      label: "Total mass reduction percent",
      kind: "number",
    },
    {
      id: "conditionalVolatileLossPercent",
      label: "Conditional volatile loss percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInitialSauceMassG: value.observedInitialSauceMassG as number,
      observedFinalSauceMassG: value.observedFinalSauceMassG as number,
      independentlyRemovedNonVolatileMassG:
        value.independentlyRemovedNonVolatileMassG as number,
    }),
});
export const run = tool.execute;
export default tool;
