import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BornhuetterFergusonReserveInput = {
  readonly earnedPremium: number;
  readonly expectedLossRatioPercent: number;
  readonly unreportedFraction: number;
};

export type BornhuetterFergusonReserveOutput = {
  readonly ibnrReserve: number;
};

export const bornhuetterFergusonReserveExample = {
  input: {
    earnedPremium: 1000000,
    expectedLossRatioPercent: 65,
    unreportedFraction: 0.4,
  },
  output: {
    ibnrReserve: 260000,
  },
} satisfies ToolExample<
  BornhuetterFergusonReserveInput,
  BornhuetterFergusonReserveOutput
>;

export const calculateBornhuetterFergusonReserve = (
  input: BornhuetterFergusonReserveInput,
): BornhuetterFergusonReserveOutput => {
  if (input.earnedPremium < 0)
    simpleError(
      "earnedPremium",
      "Earned premium cannot be negative.",
      "invalid_premium",
    );
  if (input.expectedLossRatioPercent < 0)
    simpleError(
      "expectedLossRatioPercent",
      "Expected loss ratio cannot be negative.",
      "invalid_loss_ratio",
    );
  if (input.unreportedFraction < 0 || input.unreportedFraction > 1)
    simpleError(
      "unreportedFraction",
      "The unreported fraction must be between zero and one.",
      "invalid_fraction",
    );
  const ibnrReserve =
    input.earnedPremium *
    (input.expectedLossRatioPercent / 100) *
    input.unreportedFraction;
  if (!Number.isFinite(ibnrReserve))
    simpleError(
      "earnedPremium",
      "The reserve is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    ibnrReserve,
  };
};

export const bornhuetterFergusonReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateBornhuetterFergusonReserve({
      earnedPremium: input.earnedPremium as number,
      expectedLossRatioPercent: input.expectedLossRatioPercent as number,
      unreportedFraction: input.unreportedFraction as number,
    }),
  description:
    "Estimate the IBNR reserve with the Bornhuetter-Ferguson method from earned premium, the expected loss ratio, and the portion of losses not yet reported.",
  id: "actuarial/bornhuetter-ferguson-reserve",
  inputs: [
    {
      description: "Premium earned over the exposure period.",
      id: "earnedPremium",
      kind: "number",
      label: "Earned premium",
      minimum: 0,
    },
    {
      description: "Expected ultimate loss ratio for the book.",
      id: "expectedLossRatioPercent",
      kind: "number",
      label: "Expected loss ratio",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Fraction of ultimate losses not yet reported.",
      id: "unreportedFraction",
      kind: "number",
      label: "Unreported fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "IBNR reserve implied by the Bornhuetter-Ferguson method.",
      id: "ibnrReserve",
      kind: "number",
      label: "IBNR reserve",
    },
  ],
  title: "Bornhuetter-Ferguson Reserve Calculator",
});
export const runBornhuetterFergusonReserve =
  bornhuetterFergusonReserveTool.execute;
export default bornhuetterFergusonReserveTool;
