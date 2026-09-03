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
  bounded,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPickupMassesG: readonly number[];
  readonly callerFlourEggCrumbOrder: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalPickupG: number;
  readonly observedPickupFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPickupMassesG",
    label: "Observed pickup masses g",
    kind: "numberList",
  },
  {
    id: "callerFlourEggCrumbOrder",
    label: "Caller flour egg crumb order",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPickupMassesG.forEach((v) =>
    nonnegative(v, "observedPickupMassesG"),
  );
  if (
    input.observedPickupMassesG.length !== 3 ||
    input.callerFlourEggCrumbOrder.length !== 3 ||
    new Set(input.callerFlourEggCrumbOrder).size !== 3
  )
    simpleError(
      "stages",
      "Three actual disjoint flour/egg/crumb incremental pickups and explicit permutation.",
    );
  input.callerFlourEggCrumbOrder.forEach((v) => bounded(v, "stage", 0, 2));
  const t = positive(sum(input.observedPickupMassesG), "pickup");
  return {
    totalPickupG: t,
    observedPickupFractions: input.callerFlourEggCrumbOrder.map(
      (i) => input.observedPickupMassesG[i] / t,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPickupMassesG: [10, 20, 30],
  callerFlourEggCrumbOrder: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  totalPickupG: 60,
  observedPickupFractions: [0.16666666666666666, 0.3333333333333333, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/breading-ratio",
  title: "Cooking Breading Ratio Calculator",
  description:
    "Actual incremental three-stage breading pickup inventory in explicitly identified flour/egg/crumb order, not repeated cumulative weights or nominal ratio. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "totalPickupG", label: "Total pickup g", kind: "number" },
    {
      id: "observedPickupFractions",
      label: "Observed pickup fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPickupMassesG: value.observedPickupMassesG as readonly number[],
      callerFlourEggCrumbOrder:
        value.callerFlourEggCrumbOrder as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
