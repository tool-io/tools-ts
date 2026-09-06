import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch37-shared.js";
import { money, integer, roundMinor } from "../../accounting/money.js";
export type Input = Readonly<{
  readonly callerBaseRecoveredRevenuePerBlockMinor: readonly number[];
  readonly callerFixedBlockCostsMinor: readonly number[];
  readonly callerWhittleRevenueFactorBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly scaledBlockNetValuesMinor: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "callerBaseRecoveredRevenuePerBlockMinor",
    label: "Caller base recovered revenue per block minor",
    kind: "numberList",
  },
  {
    id: "callerFixedBlockCostsMinor",
    label: "Caller fixed block costs minor",
    kind: "numberList",
  },
  {
    id: "callerWhittleRevenueFactorBasisPoints",
    label: "Caller whittle revenue factor basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const amounts of [
    input.callerBaseRecoveredRevenuePerBlockMinor,
    input.callerFixedBlockCostsMinor,
  ])
    amounts.forEach((v) => {
      money(v, "amountMinor");
      if (v > 1e12)
        simpleError("amountMinor", "At most 1e12 minor units per input.");
    });
  input.callerWhittleRevenueFactorBasisPoints.forEach((v) =>
    bounded(v, "factorBasisPoints", 0, 1000000),
  );
  aligned(
    input.callerBaseRecoveredRevenuePerBlockMinor,
    input.callerFixedBlockCostsMinor,
    "callerBaseRecoveredRevenuePerBlockMinor",
  );
  if (
    input.callerWhittleRevenueFactorBasisPoints.length > 128 ||
    input.callerBaseRecoveredRevenuePerBlockMinor.length > 128
  )
    simpleError("matrix", "At most128 factors×128 supplied blocks.");
  return {
    scaledBlockNetValuesMinor: input.callerWhittleRevenueFactorBasisPoints.map(
      (f) =>
        input.callerBaseRecoveredRevenuePerBlockMinor.map((v, i) =>
          integer(
            roundMinor(BigInt(v) * BigInt(f), 10000n) -
              input.callerFixedBlockCostsMinor[i],
            "netMinor",
          ),
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBaseRecoveredRevenuePerBlockMinor: [10, 20],
  callerFixedBlockCostsMinor: [5, 15],
  callerWhittleRevenueFactorBasisPoints: [5000, 10000],
} satisfies Input;
export const exampleOutput = {
  scaledBlockNetValuesMinor: [
    [0, -5],
    [5, 5],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/whittle-pit-optimization-factor",
  title: "Whittle Pit Optimization Factor Calculator",
  description:
    "Generate Whittle-style supplied block economic sensitivity weights across explicit revenue factors, no pit closure, precedences or optimized shell claim. Safe integer minor units in one caller currency, each input at most 1e12; integer factor basis points 0–1000000, 10000=1. Exact BigInt scaled revenue rounds once to nearest minor unit, ties away from zero, then subtracts exact block cost. Signed losses retained. No resource classification or financial forecast assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "scaledBlockNetValuesMinor",
      label: "Scaled block net values minor",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBaseRecoveredRevenuePerBlockMinor:
        value.callerBaseRecoveredRevenuePerBlockMinor as readonly number[],
      callerFixedBlockCostsMinor:
        value.callerFixedBlockCostsMinor as readonly number[],
      callerWhittleRevenueFactorBasisPoints:
        value.callerWhittleRevenueFactorBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
