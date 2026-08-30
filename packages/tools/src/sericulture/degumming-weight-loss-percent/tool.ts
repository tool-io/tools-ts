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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly beforeMassGrams: number;
  readonly beforeMoistureFraction: number;
  readonly afterMassGrams: number;
  readonly afterMoistureFraction: number;
  readonly removedBathDrySolidsGrams: number;
}>;
export type Output = Readonly<{
  readonly asReceivedLossPercent: number;
  readonly dryMatterLossPercent: number;
  readonly unclosedDryMatterGrams: number;
}>;
const inputFields = [
  { id: "beforeMassGrams", label: "Before mass grams", kind: "number" },
  {
    id: "beforeMoistureFraction",
    label: "Before moisture fraction",
    kind: "number",
  },
  { id: "afterMassGrams", label: "After mass grams", kind: "number" },
  {
    id: "afterMoistureFraction",
    label: "After moisture fraction",
    kind: "number",
  },
  {
    id: "removedBathDrySolidsGrams",
    label: "Removed bath dry solids grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.beforeMassGrams, "beforeMassGrams");
  nonnegative(input.afterMassGrams, "afterMassGrams");
  nonnegative(input.removedBathDrySolidsGrams, "removedBathDrySolidsGrams");
  fraction(input.beforeMoistureFraction, "beforeMoistureFraction");
  fraction(input.afterMoistureFraction, "afterMoistureFraction");
  const before = positive(
      input.beforeMassGrams * (1 - input.beforeMoistureFraction),
      "beforeMoistureFraction",
    ),
    after = input.afterMassGrams * (1 - input.afterMoistureFraction);
  if (after > before)
    simpleError("afterMassGrams", "Dry after mass exceeds initial dry mass.");
  return {
    asReceivedLossPercent:
      100 * (1 - input.afterMassGrams / input.beforeMassGrams),
    dryMatterLossPercent: 100 * (1 - after / before),
    unclosedDryMatterGrams: before - after - input.removedBathDrySolidsGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  beforeMassGrams: 100,
  beforeMoistureFraction: 0.2,
  afterMassGrams: 80,
  afterMoistureFraction: 0.1,
  removedBathDrySolidsGrams: 7,
} satisfies Input;
export const exampleOutput = {
  asReceivedLossPercent: 20,
  dryMatterLossPercent: 10,
  unclosedDryMatterGrams: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/degumming-weight-loss-percent",
  title: "Degumming Weight Loss Percent",
  description:
    "Audit degumming dry-matter loss and independently recovered bath-solids closure while retaining signed wet-mass and balance contrasts; loss is not automatically pure sericin removal.",
  inputs: inputFields,
  outputs: [
    {
      id: "asReceivedLossPercent",
      label: "As received loss percent",
      kind: "number",
    },
    {
      id: "dryMatterLossPercent",
      label: "Dry matter loss percent",
      kind: "number",
    },
    {
      id: "unclosedDryMatterGrams",
      label: "Unclosed dry matter grams",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      beforeMassGrams: value.beforeMassGrams as number,
      beforeMoistureFraction: value.beforeMoistureFraction as number,
      afterMassGrams: value.afterMassGrams as number,
      afterMoistureFraction: value.afterMoistureFraction as number,
      removedBathDrySolidsGrams: value.removedBathDrySolidsGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
