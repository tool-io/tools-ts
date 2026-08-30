import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";

export type Input = Readonly<{
  readonly signedTransectPositionsKm: readonly number[];
  readonly vaporMixingRatiosGramsPerKg: readonly number[];
  readonly callerAbsoluteGradientThresholdGramsPerKgKm: number;
}>;
export type Output = Readonly<{
  readonly intervalSignedMixingRatioGradients: readonly number[];
  readonly aboveCallerAbsoluteGradientFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "signedTransectPositionsKm",
    label: "Signed transect positions km",
    kind: "numberList",
  },
  {
    id: "vaporMixingRatiosGramsPerKg",
    label: "Vapor mixing ratios grams per kg",
    kind: "numberList",
  },
  {
    id: "callerAbsoluteGradientThresholdGramsPerKgKm",
    label: "Caller absolute gradient threshold grams per kg km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.vaporMixingRatiosGramsPerKg.forEach((v) =>
    nonnegative(v, "vaporMixingRatiosGramsPerKg"),
  );
  nonnegative(
    input.callerAbsoluteGradientThresholdGramsPerKgKm,
    "callerAbsoluteGradientThresholdGramsPerKgKm",
  );
  aligned(
    input.signedTransectPositionsKm,
    input.vaporMixingRatiosGramsPerKg,
    "signedTransectPositionsKm",
  );
  ordered(input.signedTransectPositionsKm, "positions");
  const intervalSignedMixingRatioGradients = input.vaporMixingRatiosGramsPerKg
    .slice(1)
    .map(
      (q, i) =>
        (q - input.vaporMixingRatiosGramsPerKg[i]) /
        (input.signedTransectPositionsKm[i + 1] -
          input.signedTransectPositionsKm[i]),
    );
  return {
    intervalSignedMixingRatioGradients,
    aboveCallerAbsoluteGradientFlags: intervalSignedMixingRatioGradients.map(
      (g) =>
        Math.abs(g) > input.callerAbsoluteGradientThresholdGramsPerKgKm ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedTransectPositionsKm: [0, 10, 20],
  vaporMixingRatiosGramsPerKg: [5, 15, 10],
  callerAbsoluteGradientThresholdGramsPerKgKm: 0.8,
} satisfies Input;
export const exampleOutput = {
  intervalSignedMixingRatioGradients: [1, -0.5],
  aboveCallerAbsoluteGradientFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/dryline-mixing-ratio-gradient-checker",
  title: "Dryline Mixing Ratio Gradient Checker",
  description:
    "Screen observed signed moisture gradients on caller measured planar transect distances; no coordinate distance computation or dryline identification from humidity gradient alone.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalSignedMixingRatioGradients",
      label: "Interval signed mixing ratio gradients",
      kind: "numberList",
    },
    {
      id: "aboveCallerAbsoluteGradientFlags",
      label: "Above caller absolute gradient flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      signedTransectPositionsKm:
        value.signedTransectPositionsKm as readonly number[],
      vaporMixingRatiosGramsPerKg:
        value.vaporMixingRatiosGramsPerKg as readonly number[],
      callerAbsoluteGradientThresholdGramsPerKgKm:
        value.callerAbsoluteGradientThresholdGramsPerKgKm as number,
    }),
});
export const run = tool.execute;
export default tool;
