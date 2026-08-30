import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly elementMeatMassesKg: readonly number[];
  readonly elementMarrowMassesKg: readonly number[];
  readonly callerMarrowUtilityWeight: number;
}>;
export type Output = Readonly<{
  readonly combinedUtilityMassesKg: readonly number[];
  readonly maximumNormalizedUtilityPercentages: readonly number[];
}>;
const inputFields = [
  {
    id: "elementMeatMassesKg",
    label: "Element meat masses kg",
    kind: "numberList",
  },
  {
    id: "elementMarrowMassesKg",
    label: "Element marrow masses kg",
    kind: "numberList",
  },
  {
    id: "callerMarrowUtilityWeight",
    label: "Caller marrow utility weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.elementMeatMassesKg.forEach((v) =>
    nonnegative(v, "elementMeatMassesKg"),
  );
  input.elementMarrowMassesKg.forEach((v) =>
    nonnegative(v, "elementMarrowMassesKg"),
  );
  nonnegative(input.callerMarrowUtilityWeight, "callerMarrowUtilityWeight");
  aligned(
    input.elementMeatMassesKg,
    input.elementMarrowMassesKg,
    "elementMeatMassesKg",
  );
  const combinedUtilityMassesKg = input.elementMeatMassesKg.map(
      (v, i) =>
        v + input.callerMarrowUtilityWeight * input.elementMarrowMassesKg[i],
    ),
    max = positive(maximum(combinedUtilityMassesKg), "utility");
  return {
    combinedUtilityMassesKg,
    maximumNormalizedUtilityPercentages: combinedUtilityMassesKg.map(
      (v) => (100 * v) / max,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elementMeatMassesKg: [1, 3, 0],
  elementMarrowMassesKg: [1, 0, 1],
  callerMarrowUtilityWeight: 2,
} satisfies Input;
export const exampleOutput = {
  combinedUtilityMassesKg: [3, 3, 2],
  maximumNormalizedUtilityPercentages: [100, 100, 66.66666666666667],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/meat-weight-utility-index",
  title: "Meat Weight Utility Index",
  description:
    "Combine measured element-associated meat/marrow mass using caller weighting and normalize to maximum; these are model utility scores, not recovered food yield or behavioral preference.",
  inputs: inputFields,
  outputs: [
    {
      id: "combinedUtilityMassesKg",
      label: "Combined utility masses kg",
      kind: "numberList",
    },
    {
      id: "maximumNormalizedUtilityPercentages",
      label: "Maximum normalized utility percentages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      elementMeatMassesKg: value.elementMeatMassesKg as readonly number[],
      elementMarrowMassesKg: value.elementMarrowMassesKg as readonly number[],
      callerMarrowUtilityWeight: value.callerMarrowUtilityWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
