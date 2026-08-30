import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialUsableSorptionCapacityGrams: number;
  readonly dailyMoistureIngressGrams: readonly number[];
  readonly callerReservedCapacityGrams: number;
}>;
export type Output = Readonly<{
  readonly remainingCapacitiesAfterDaysGrams: readonly number[];
  readonly firstReserveBreachDayIndex: number;
  readonly reserveBreachObserved: boolean;
}>;
const inputFields = [
  {
    id: "initialUsableSorptionCapacityGrams",
    label: "Initial usable sorption capacity grams",
    kind: "number",
  },
  {
    id: "dailyMoistureIngressGrams",
    label: "Daily moisture ingress grams",
    kind: "numberList",
  },
  {
    id: "callerReservedCapacityGrams",
    label: "Caller reserved capacity grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.initialUsableSorptionCapacityGrams,
    "initialUsableSorptionCapacityGrams",
  );
  input.dailyMoistureIngressGrams.forEach((v) =>
    nonnegative(v, "dailyMoistureIngressGrams"),
  );
  nonnegative(input.callerReservedCapacityGrams, "callerReservedCapacityGrams");
  if (
    !input.dailyMoistureIngressGrams.length ||
    input.callerReservedCapacityGrams > input.initialUsableSorptionCapacityGrams
  )
    simpleError(
      "capacity",
      "Nonempty daily coverage and reserve within initial capacity required.",
    );
  let cap = input.initialUsableSorptionCapacityGrams;
  const r = input.dailyMoistureIngressGrams.map((v) => (cap -= v)),
    i = r.findIndex((v) => v < input.callerReservedCapacityGrams);
  return {
    remainingCapacitiesAfterDaysGrams: r,
    firstReserveBreachDayIndex: i,
    reserveBreachObserved: i !== -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialUsableSorptionCapacityGrams: 10,
  dailyMoistureIngressGrams: [2, 3, 6],
  callerReservedCapacityGrams: 1,
} satisfies Input;
export const exampleOutput = {
  remainingCapacitiesAfterDaysGrams: [8, 5, -1],
  firstReserveBreachDayIndex: 2,
  reserveBreachObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/silica-gel-capacity-lifespan",
  title: "Silica Gel Conditioning Capacity Lifespan Calculator",
  description:
    "Track sequential gel-capacity depletion against caller reserve on observed/forecast gap-free daily moisture, retaining negative overdraw and no observed breach sentinel; no unobserved lifespan extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "remainingCapacitiesAfterDaysGrams",
      label: "Remaining capacities after days grams",
      kind: "numberList",
    },
    {
      id: "firstReserveBreachDayIndex",
      label: "First reserve breach day index",
      kind: "number",
    },
    {
      id: "reserveBreachObserved",
      label: "Reserve breach observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      initialUsableSorptionCapacityGrams:
        value.initialUsableSorptionCapacityGrams as number,
      dailyMoistureIngressGrams:
        value.dailyMoistureIngressGrams as readonly number[],
      callerReservedCapacityGrams: value.callerReservedCapacityGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
