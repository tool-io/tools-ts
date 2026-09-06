import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCumulativePitWasteTonnes: readonly number[];
  readonly observedCumulativePitOreTonnes: readonly number[];
  readonly callerPreviousCumulativePitWasteTonnes: readonly number[];
  readonly callerPreviousCumulativePitOreTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedIncrementalWasteOreRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCumulativePitWasteTonnes",
    label: "Observed cumulative pit waste tonnes",
    kind: "numberList",
  },
  {
    id: "observedCumulativePitOreTonnes",
    label: "Observed cumulative pit ore tonnes",
    kind: "numberList",
  },
  {
    id: "callerPreviousCumulativePitWasteTonnes",
    label: "Caller previous cumulative pit waste tonnes",
    kind: "numberList",
  },
  {
    id: "callerPreviousCumulativePitOreTonnes",
    label: "Caller previous cumulative pit ore tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCumulativePitWasteTonnes.forEach((v) =>
    nonnegative(v, "observedCumulativePitWasteTonnes"),
  );
  input.observedCumulativePitOreTonnes.forEach((v) =>
    nonnegative(v, "observedCumulativePitOreTonnes"),
  );
  input.callerPreviousCumulativePitWasteTonnes.forEach((v) =>
    nonnegative(v, "callerPreviousCumulativePitWasteTonnes"),
  );
  input.callerPreviousCumulativePitOreTonnes.forEach((v) =>
    nonnegative(v, "callerPreviousCumulativePitOreTonnes"),
  );
  aligned(
    input.observedCumulativePitWasteTonnes,
    input.observedCumulativePitOreTonnes,
    "observedCumulativePitWasteTonnes",
  );
  aligned(
    input.observedCumulativePitWasteTonnes,
    input.callerPreviousCumulativePitWasteTonnes,
    "observedCumulativePitWasteTonnes",
  );
  aligned(
    input.observedCumulativePitWasteTonnes,
    input.callerPreviousCumulativePitOreTonnes,
    "observedCumulativePitWasteTonnes",
  );
  return {
    observedIncrementalWasteOreRatios:
      input.observedCumulativePitWasteTonnes.map((v, i) => {
        const waste = v - input.callerPreviousCumulativePitWasteTonnes[i],
          ore =
            input.observedCumulativePitOreTonnes[i] -
            input.callerPreviousCumulativePitOreTonnes[i];
        nonnegative(waste, "incremental waste");
        positive(ore, "incremental ore");
        return waste / ore;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCumulativePitWasteTonnes: [10, 30],
  observedCumulativePitOreTonnes: [5, 10],
  callerPreviousCumulativePitWasteTonnes: [0, 10],
  callerPreviousCumulativePitOreTonnes: [0, 5],
} satisfies Input;
export const exampleOutput = {
  observedIncrementalWasteOreRatios: [2, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-ratio-average",
  title: "Average Stripping Ratio Calculator",
  description:
    "Audit actual independently matched CumulativePit inventory deltas, not forecast nested-shell stripping or a bank-volume density converter; previous figures explicitly identify scenario baseline. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIncrementalWasteOreRatios",
      label: "Observed incremental waste ore ratios",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCumulativePitWasteTonnes:
        value.observedCumulativePitWasteTonnes as readonly number[],
      observedCumulativePitOreTonnes:
        value.observedCumulativePitOreTonnes as readonly number[],
      callerPreviousCumulativePitWasteTonnes:
        value.callerPreviousCumulativePitWasteTonnes as readonly number[],
      callerPreviousCumulativePitOreTonnes:
        value.callerPreviousCumulativePitOreTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
