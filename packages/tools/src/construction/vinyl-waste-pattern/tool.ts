import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerActualVinylRunLengthsM: readonly number[];
  readonly callerVinylPatternRepeatM: number;
  readonly callerCutEndAllowanceM: number;
}>;
export type Output = Readonly<{
  readonly patternAlignedPurchaseRunLengthsM: readonly number[];
  readonly totalPatternOffcutM: number;
}>;
const inputFields = [
  {
    id: "callerActualVinylRunLengthsM",
    label: "Caller actual vinyl run lengths m",
    kind: "numberList",
  },
  {
    id: "callerVinylPatternRepeatM",
    label: "Caller vinyl pattern repeat m",
    kind: "number",
  },
  {
    id: "callerCutEndAllowanceM",
    label: "Caller cut end allowance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerActualVinylRunLengthsM.forEach((v) =>
    positive(v, "callerActualVinylRunLengthsM"),
  );
  positive(input.callerVinylPatternRepeatM, "callerVinylPatternRepeatM");
  nonnegative(input.callerCutEndAllowanceM, "callerCutEndAllowanceM");
  const rounded = input.callerActualVinylRunLengthsM.map(
    (v) =>
      Math.ceil(
        (v + input.callerCutEndAllowanceM) / input.callerVinylPatternRepeatM,
      ) * input.callerVinylPatternRepeatM,
  );
  return {
    patternAlignedPurchaseRunLengthsM: rounded,
    totalPatternOffcutM: sum(rounded) - sum(input.callerActualVinylRunLengthsM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerActualVinylRunLengthsM: [3, 5],
  callerVinylPatternRepeatM: 2,
  callerCutEndAllowanceM: 0.1,
} satisfies Input;
export const exampleOutput = {
  patternAlignedPurchaseRunLengthsM: [4, 6],
  totalPatternOffcutM: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/vinyl-waste-pattern",
  title: "Vinyl Waste Pattern Calculator",
  description:
    "Discrete per-run vinyl pattern-repeat alignment before summed offcut, not fixed flooring waste percentage. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "patternAlignedPurchaseRunLengthsM",
      label: "Pattern aligned purchase run lengths m",
      kind: "numberList",
    },
    {
      id: "totalPatternOffcutM",
      label: "Total pattern offcut m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerActualVinylRunLengthsM:
        value.callerActualVinylRunLengthsM as readonly number[],
      callerVinylPatternRepeatM: value.callerVinylPatternRepeatM as number,
      callerCutEndAllowanceM: value.callerCutEndAllowanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
