import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPizzaSauceUsedG: readonly number[];
  readonly observedMatchedPizzaAreasCM2: readonly number[];
  readonly callerCoverageGCM2: number;
}>;
export type Output = Readonly<{
  readonly observedCoverageGCM2: readonly number[];
  readonly signedTargetDiscrepanciesG: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPizzaSauceUsedG",
    label: "Observed pizza sauce used g",
    kind: "numberList",
  },
  {
    id: "observedMatchedPizzaAreasCM2",
    label: "Observed matched pizza areas c m2",
    kind: "numberList",
  },
  { id: "callerCoverageGCM2", label: "Caller coverage g c m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedPizzaAreasCM2.forEach((v) =>
    positive(v, "observedMatchedPizzaAreasCM2"),
  );
  input.observedPizzaSauceUsedG.forEach((v) =>
    nonnegative(v, "observedPizzaSauceUsedG"),
  );
  nonnegative(input.callerCoverageGCM2, "callerCoverageGCM2");
  aligned(
    input.observedPizzaSauceUsedG,
    input.observedMatchedPizzaAreasCM2,
    "observedPizzaSauceUsedG",
  );
  return {
    observedCoverageGCM2: input.observedPizzaSauceUsedG.map(
      (v, i) => v / input.observedMatchedPizzaAreasCM2[i],
    ),
    signedTargetDiscrepanciesG: input.observedPizzaSauceUsedG.map(
      (v, i) =>
        v - input.observedMatchedPizzaAreasCM2[i] * input.callerCoverageGCM2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPizzaSauceUsedG: [40, 70],
  observedMatchedPizzaAreasCM2: [100, 200],
  callerCoverageGCM2: 0.3,
} satisfies Input;
export const exampleOutput = {
  observedCoverageGCM2: [0.4, 0.35],
  signedTargetDiscrepanciesG: [10, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/pizza-sauce-per-dough-ball",
  title: "Cooking Pizza Sauce Per Dough Ball Calculator",
  description:
    "Actual PizzaSauce loading normalized to measured pizza areas and caller target, not universal per-ball grams or proportional serving scaling. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCoverageGCM2",
      label: "Observed coverage g c m2",
      kind: "numberList",
    },
    {
      id: "signedTargetDiscrepanciesG",
      label: "Signed target discrepancies g",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPizzaSauceUsedG:
        value.observedPizzaSauceUsedG as readonly number[],
      observedMatchedPizzaAreasCM2:
        value.observedMatchedPizzaAreasCM2 as readonly number[],
      callerCoverageGCM2: value.callerCoverageGCM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
