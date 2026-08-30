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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly wholeCocoonMassesGrams: readonly number[];
  readonly shellMassesGrams: readonly number[];
  readonly wholeMoistureFractions: readonly number[];
  readonly shellMoistureFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly asReceivedShellPercents: readonly number[];
  readonly pooledAsReceivedShellPercent: number;
  readonly pooledDryBasisShellPercent: number;
}>;
const inputFields = [
  {
    id: "wholeCocoonMassesGrams",
    label: "Whole cocoon masses grams",
    kind: "numberList",
  },
  { id: "shellMassesGrams", label: "Shell masses grams", kind: "numberList" },
  {
    id: "wholeMoistureFractions",
    label: "Whole moisture fractions",
    kind: "numberList",
  },
  {
    id: "shellMoistureFractions",
    label: "Shell moisture fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.wholeCocoonMassesGrams.forEach((v) =>
    positive(v, "wholeCocoonMassesGrams"),
  );
  input.shellMassesGrams.forEach((v) => nonnegative(v, "shellMassesGrams"));
  input.wholeMoistureFractions.forEach((v) =>
    fraction(v, "wholeMoistureFractions"),
  );
  input.shellMoistureFractions.forEach((v) =>
    fraction(v, "shellMoistureFractions"),
  );
  aligned(
    input.wholeCocoonMassesGrams,
    input.shellMassesGrams,
    "wholeCocoonMassesGrams",
  );
  aligned(
    input.wholeCocoonMassesGrams,
    input.wholeMoistureFractions,
    "wholeCocoonMassesGrams",
  );
  aligned(
    input.wholeCocoonMassesGrams,
    input.shellMoistureFractions,
    "wholeCocoonMassesGrams",
  );
  let dryWhole = 0,
    dryShell = 0;
  input.wholeCocoonMassesGrams.forEach((v, i) => {
    const s = input.shellMassesGrams[i],
      w = v * (1 - input.wholeMoistureFractions[i]),
      d = s * (1 - input.shellMoistureFractions[i]);
    if (s > v || d > w)
      simpleError(
        "shellMassesGrams",
        "Shell cannot exceed whole mass on either basis.",
      );
    dryWhole += w;
    dryShell += d;
  });
  return {
    asReceivedShellPercents: input.shellMassesGrams.map(
      (v, i) => (100 * v) / input.wholeCocoonMassesGrams[i],
    ),
    pooledAsReceivedShellPercent:
      (100 * input.shellMassesGrams.reduce((a, b) => a + b, 0)) /
      input.wholeCocoonMassesGrams.reduce((a, b) => a + b, 0),
    pooledDryBasisShellPercent:
      (100 * dryShell) / positive(dryWhole, "wholeMoistureFractions"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wholeCocoonMassesGrams: [2, 3],
  shellMassesGrams: [0.4, 0.9],
  wholeMoistureFractions: [0.5, 0.5],
  shellMoistureFractions: [0.1, 0.1],
} satisfies Input;
export const exampleOutput = {
  asReceivedShellPercents: [20, 30],
  pooledAsReceivedShellPercent: 26,
  pooledDryBasisShellPercent: 46.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/shell-weight-percent-sr",
  title: "Shell Weight Percent SR",
  description:
    "Compare matched shell/whole mass ratios on as-received and moisture-corrected dry bases, preserving pooled mass weighting instead of averaging individual percentages.",
  inputs: inputFields,
  outputs: [
    {
      id: "asReceivedShellPercents",
      label: "As received shell percents",
      kind: "numberList",
    },
    {
      id: "pooledAsReceivedShellPercent",
      label: "Pooled as received shell percent",
      kind: "number",
    },
    {
      id: "pooledDryBasisShellPercent",
      label: "Pooled dry basis shell percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      wholeCocoonMassesGrams: value.wholeCocoonMassesGrams as readonly number[],
      shellMassesGrams: value.shellMassesGrams as readonly number[],
      wholeMoistureFractions: value.wholeMoistureFractions as readonly number[],
      shellMoistureFractions: value.shellMoistureFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
