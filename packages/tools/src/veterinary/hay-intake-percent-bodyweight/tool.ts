import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualDailyFeedAsFedKg: number;
  readonly independentlyMeasuredHorseMassKg: number;
  readonly verifiedDryMatterFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDailyFeedAsFedKg",
    label: "Actual daily feed as fed kg",
    kind: "number",
  },
  {
    id: "independentlyMeasuredHorseMassKg",
    label: "Independently measured horse mass kg",
    kind: "number",
  },
  {
    id: "verifiedDryMatterFraction",
    label: "Verified dry matter fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDailyFeedAsFedKg, "actual-feed");
  positive(input.independentlyMeasuredHorseMassKg, "mass");
  fraction(input.verifiedDryMatterFraction, "drymatter");
  return {
    observedAsFedPercentBodyMassPerDay:
      (100 * input.actualDailyFeedAsFedKg) /
      input.independentlyMeasuredHorseMassKg,
    observedDryMatterPercentBodyMassPerDay:
      (100 * input.actualDailyFeedAsFedKg * input.verifiedDryMatterFraction) /
      input.independentlyMeasuredHorseMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDailyFeedAsFedKg: 10,
    independentlyMeasuredHorseMassKg: 500,
    verifiedDryMatterFraction: 0.9,
  },
  output: {
    result: {
      observedAsFedPercentBodyMassPerDay: 2,
      observedDryMatterPercentBodyMassPerDay: 1.8,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/hay-intake-percent-bodyweight",
  title: "Hay Intake Percent Bodyweight Calculator",
  description:
    "Actual horse actual hay mass/bodymass percent with verified dry-matter conversion. Not a recommended ration, grain/forage safety, complete nutrition or clinical assessment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
