import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  sum,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly perArmAnnotatedChargeCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "perArmAnnotatedChargeCounts",
    label: "Per arm annotated charge counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.perArmAnnotatedChargeCounts.forEach((v) =>
    nonnegative(v, "perArmAnnotatedChargeCounts"),
  );
  input.perArmAnnotatedChargeCounts.forEach((v) => integer(v, "count"));
  return {
    totalChargeOccurrences: sum(input.perArmAnnotatedChargeCounts),
    armsWithCharge: input.perArmAnnotatedChargeCounts.filter((v) => v > 0)
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { perArmAnnotatedChargeCounts: [2, 0, 1] },
  output: { result: { totalChargeOccurrences: 3, armsWithCharge: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/eagle-frequency-counter-roll",
  title: "Eagle Charge Frequency Counter Across Roll",
  description:
    "Count independently annotated eagleoccurrences and armorial presence separately, not infer species from heraldic names.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
