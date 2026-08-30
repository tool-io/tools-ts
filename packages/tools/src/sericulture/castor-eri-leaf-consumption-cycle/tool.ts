import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly initialEriLarvae: number;
  readonly stageDurationDays: readonly number[];
  readonly stageSurvivalFractions: readonly number[];
  readonly consumedCastorLeafGramsPerLarvaDay: readonly number[];
  readonly unconsumedOfferedLeafFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly expectedConsumedLeafKgByStage: readonly number[];
  readonly requiredOfferedLeafKgByStage: readonly number[];
  readonly totalRequiredOfferedLeafKg: number;
}>;
const inputFields = [
  { id: "initialEriLarvae", label: "Initial eri larvae", kind: "integer" },
  { id: "stageDurationDays", label: "Stage duration days", kind: "numberList" },
  {
    id: "stageSurvivalFractions",
    label: "Stage survival fractions",
    kind: "numberList",
  },
  {
    id: "consumedCastorLeafGramsPerLarvaDay",
    label: "Consumed castor leaf grams per larva day",
    kind: "numberList",
  },
  {
    id: "unconsumedOfferedLeafFractions",
    label: "Unconsumed offered leaf fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stageDurationDays.forEach((v) => nonnegative(v, "stageDurationDays"));
  input.consumedCastorLeafGramsPerLarvaDay.forEach((v) =>
    nonnegative(v, "consumedCastorLeafGramsPerLarvaDay"),
  );
  input.stageSurvivalFractions.forEach((v) =>
    fraction(v, "stageSurvivalFractions"),
  );
  input.unconsumedOfferedLeafFractions.forEach((v) =>
    fraction(v, "unconsumedOfferedLeafFractions"),
  );
  count(input.initialEriLarvae, "initialEriLarvae");
  aligned(
    input.stageDurationDays,
    input.stageSurvivalFractions,
    "stageDurationDays",
  );
  aligned(
    input.stageDurationDays,
    input.consumedCastorLeafGramsPerLarvaDay,
    "stageDurationDays",
  );
  aligned(
    input.stageDurationDays,
    input.unconsumedOfferedLeafFractions,
    "stageDurationDays",
  );
  if (
    input.stageSurvivalFractions.some(
      (v, i) => i > 0 && v > input.stageSurvivalFractions[i - 1],
    ) ||
    input.unconsumedOfferedLeafFractions.some((v) => v === 1)
  )
    simpleError(
      "stages",
      "Nonincreasing cumulative stage survival and unconsumed fractions below one required.",
    );
  const expectedConsumedLeafKgByStage = input.stageDurationDays.map(
      (v, i) =>
        (input.initialEriLarvae *
          input.stageSurvivalFractions[i] *
          v *
          input.consumedCastorLeafGramsPerLarvaDay[i]) /
        1000,
    ),
    requiredOfferedLeafKgByStage = expectedConsumedLeafKgByStage.map(
      (v, i) => v / (1 - input.unconsumedOfferedLeafFractions[i]),
    );
  return {
    expectedConsumedLeafKgByStage,
    requiredOfferedLeafKgByStage,
    totalRequiredOfferedLeafKg: requiredOfferedLeafKgByStage.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialEriLarvae: 100,
  stageDurationDays: [2, 3],
  stageSurvivalFractions: [1, 0.8],
  consumedCastorLeafGramsPerLarvaDay: [1, 2],
  unconsumedOfferedLeafFractions: [0.2, 0.25],
} satisfies Input;
export const exampleOutput = {
  expectedConsumedLeafKgByStage: [0.2, 0.48],
  requiredOfferedLeafKgByStage: [0.25, 0.64],
  totalRequiredOfferedLeafKg: 0.89,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/castor-eri-leaf-consumption-cycle",
  title: "Castor Eri Leaf Consumption Cycle",
  description:
    "Plan eri castor-leaf demand from stage duration, expected survival and measured per-larva consumption plus leftovers; distinct from observed leaf/cocoon harvest FCR.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedConsumedLeafKgByStage",
      label: "Expected consumed leaf kg by stage",
      kind: "numberList",
    },
    {
      id: "requiredOfferedLeafKgByStage",
      label: "Required offered leaf kg by stage",
      kind: "numberList",
    },
    {
      id: "totalRequiredOfferedLeafKg",
      label: "Total required offered leaf kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialEriLarvae: value.initialEriLarvae as number,
      stageDurationDays: value.stageDurationDays as readonly number[],
      stageSurvivalFractions: value.stageSurvivalFractions as readonly number[],
      consumedCastorLeafGramsPerLarvaDay:
        value.consumedCastorLeafGramsPerLarvaDay as readonly number[],
      unconsumedOfferedLeafFractions:
        value.unconsumedOfferedLeafFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
