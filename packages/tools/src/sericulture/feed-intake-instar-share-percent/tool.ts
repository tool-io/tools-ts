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
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFiveInstarConsumedLeafDryG: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedInstarIntakeSharesPercent: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFiveInstarConsumedLeafDryG",
    label: "Observed five instar consumed leaf dry g",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFiveInstarConsumedLeafDryG.forEach((v) =>
    nonnegative(v, "observedFiveInstarConsumedLeafDryG"),
  );
  if (input.observedFiveInstarConsumedLeafDryG.length !== 5)
    simpleError(
      "instars",
      "Five independently net-consumed dry-leaf totals, leftovers already corrected.",
    );
  const total = positive(
    sum(input.observedFiveInstarConsumedLeafDryG),
    "total intake",
  );
  return {
    observedInstarIntakeSharesPercent:
      input.observedFiveInstarConsumedLeafDryG.map((v) => (100 * v) / total),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFiveInstarConsumedLeafDryG: [10, 20, 30, 40, 100],
} satisfies Input;
export const exampleOutput = {
  observedInstarIntakeSharesPercent: [5, 10, 15, 20, 50],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/feed-intake-instar-share-percent",
  title: "Feed Intake Instar Share Percent Table",
  description:
    "Actual five-instar dry-feed intake share inventory, no forecast per-larva demand or leaf/cocoon harvestFCRduplicate. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedInstarIntakeSharesPercent",
      label: "Observed instar intake shares percent",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFiveInstarConsumedLeafDryG:
        value.observedFiveInstarConsumedLeafDryG as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
