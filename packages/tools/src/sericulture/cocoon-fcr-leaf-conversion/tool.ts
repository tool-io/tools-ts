import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly leafOfferedKg: number;
  readonly uneatenLeafKg: number;
  readonly offeredLeafDryMatterFraction: number;
  readonly uneatenLeafDryMatterFraction: number;
  readonly freshCocoonYieldKg: number;
}>;
export type Output = Readonly<{
  readonly consumedFreshLeafKg: number;
  readonly consumedDryLeafKg: number;
  readonly freshLeafPerFreshCocoonKg: number;
  readonly dryLeafPerFreshCocoonKg: number;
}>;
const inputFields = [
  { id: "leafOfferedKg", label: "Leaf offered kg", kind: "number" },
  { id: "uneatenLeafKg", label: "Uneaten leaf kg", kind: "number" },
  {
    id: "offeredLeafDryMatterFraction",
    label: "Offered leaf dry matter fraction",
    kind: "number",
  },
  {
    id: "uneatenLeafDryMatterFraction",
    label: "Uneaten leaf dry matter fraction",
    kind: "number",
  },
  { id: "freshCocoonYieldKg", label: "Fresh cocoon yield kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.freshCocoonYieldKg, "freshCocoonYieldKg");
  nonnegative(input.leafOfferedKg, "leafOfferedKg");
  nonnegative(input.uneatenLeafKg, "uneatenLeafKg");
  fraction(input.offeredLeafDryMatterFraction, "offeredLeafDryMatterFraction");
  fraction(input.uneatenLeafDryMatterFraction, "uneatenLeafDryMatterFraction");
  const consumedFreshLeafKg = nonnegative(
      input.leafOfferedKg - input.uneatenLeafKg,
      "uneatenLeafKg",
    ),
    consumedDryLeafKg = nonnegative(
      input.leafOfferedKg * input.offeredLeafDryMatterFraction -
        input.uneatenLeafKg * input.uneatenLeafDryMatterFraction,
      "uneatenLeafDryMatterFraction",
    );
  return {
    consumedFreshLeafKg,
    consumedDryLeafKg,
    freshLeafPerFreshCocoonKg: consumedFreshLeafKg / input.freshCocoonYieldKg,
    dryLeafPerFreshCocoonKg: consumedDryLeafKg / input.freshCocoonYieldKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leafOfferedKg: 100,
  uneatenLeafKg: 20,
  offeredLeafDryMatterFraction: 0.2,
  uneatenLeafDryMatterFraction: 0.25,
  freshCocoonYieldKg: 10,
} satisfies Input;
export const exampleOutput = {
  consumedFreshLeafKg: 80,
  consumedDryLeafKg: 15,
  freshLeafPerFreshCocoonKg: 8,
  dryLeafPerFreshCocoonKg: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/cocoon-fcr-leaf-conversion",
  title: "Cocoon FCR Leaf Conversion",
  description:
    "Compute net consumed fresh/dry leaf per fresh cocoon harvest after separately assayed leftovers; unlike biomass-gain fish FCR, cocoon harvest is an explicitly different denominator.",
  inputs: inputFields,
  outputs: [
    {
      id: "consumedFreshLeafKg",
      label: "Consumed fresh leaf kg",
      kind: "number",
    },
    { id: "consumedDryLeafKg", label: "Consumed dry leaf kg", kind: "number" },
    {
      id: "freshLeafPerFreshCocoonKg",
      label: "Fresh leaf per fresh cocoon kg",
      kind: "number",
    },
    {
      id: "dryLeafPerFreshCocoonKg",
      label: "Dry leaf per fresh cocoon kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      leafOfferedKg: value.leafOfferedKg as number,
      uneatenLeafKg: value.uneatenLeafKg as number,
      offeredLeafDryMatterFraction:
        value.offeredLeafDryMatterFraction as number,
      uneatenLeafDryMatterFraction:
        value.uneatenLeafDryMatterFraction as number,
      freshCocoonYieldKg: value.freshCocoonYieldKg as number,
    }),
});
export const run = tool.execute;
export default tool;
