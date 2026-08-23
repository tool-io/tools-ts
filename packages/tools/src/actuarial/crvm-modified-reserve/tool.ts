import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrvmModifiedReserveInput = {
  readonly benefitPresentValue: number;
  readonly firstYearTermPremium: number;
  readonly fullPreliminaryTermRenewalPremium: number;
  readonly futurePremiumAnnuityFactor: number;
  readonly nineteenPaymentLifePremiumNextAge: number;
  readonly netLevelPremium: number;
};

export type CrvmModifiedReserveOutput = {
  readonly commissionersExpenseAllowance: number;
  readonly modifiedValuationPremium: number;
  readonly valuationReserve: number;
};

export const crvmModifiedReserveExample = {
  input: {
    benefitPresentValue: 400,
    firstYearTermPremium: 2,
    fullPreliminaryTermRenewalPremium: 35,
    futurePremiumAnnuityFactor: 12,
    nineteenPaymentLifePremiumNextAge: 12,
    netLevelPremium: 20,
  },
  output: {
    commissionersExpenseAllowance: 10,
    modifiedValuationPremium: 30,
    valuationReserve: 40,
  },
} satisfies ToolExample<CrvmModifiedReserveInput, CrvmModifiedReserveOutput>;

const nonnegative = (
  field: keyof CrvmModifiedReserveInput,
  value: number,
): void => {
  if (!Number.isFinite(value) || value < 0)
    simpleError(
      field,
      "Actuarial inputs must be finite and nonnegative.",
      "invalid_value",
    );
};

export const calculateCrvmModifiedReserve = (
  input: CrvmModifiedReserveInput,
): CrvmModifiedReserveOutput => {
  nonnegative("benefitPresentValue", input.benefitPresentValue);
  nonnegative("firstYearTermPremium", input.firstYearTermPremium);
  nonnegative(
    "fullPreliminaryTermRenewalPremium",
    input.fullPreliminaryTermRenewalPremium,
  );
  nonnegative("futurePremiumAnnuityFactor", input.futurePremiumAnnuityFactor);
  nonnegative(
    "nineteenPaymentLifePremiumNextAge",
    input.nineteenPaymentLifePremiumNextAge,
  );
  nonnegative("netLevelPremium", input.netLevelPremium);

  const fullPreliminaryTermIncrease = Math.max(
    0,
    input.fullPreliminaryTermRenewalPremium - input.netLevelPremium,
  );
  const commissionersLimit = Math.max(
    0,
    input.nineteenPaymentLifePremiumNextAge - input.firstYearTermPremium,
  );
  const commissionersExpenseAllowance = Math.min(
    fullPreliminaryTermIncrease,
    commissionersLimit,
  );
  const modifiedValuationPremium =
    input.netLevelPremium + commissionersExpenseAllowance;
  const valuationReserve =
    input.benefitPresentValue -
    modifiedValuationPremium * input.futurePremiumAnnuityFactor;

  if (
    !Number.isFinite(modifiedValuationPremium) ||
    !Number.isFinite(valuationReserve)
  )
    simpleError(
      "benefitPresentValue",
      "The modified premium or reserve is outside the finite numeric range.",
      "result_not_finite",
    );

  return {
    commissionersExpenseAllowance,
    modifiedValuationPremium,
    valuationReserve,
  };
};

export const crvmModifiedReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateCrvmModifiedReserve({
      benefitPresentValue: input.benefitPresentValue as number,
      firstYearTermPremium: input.firstYearTermPremium as number,
      fullPreliminaryTermRenewalPremium:
        input.fullPreliminaryTermRenewalPremium as number,
      futurePremiumAnnuityFactor: input.futurePremiumAnnuityFactor as number,
      nineteenPaymentLifePremiumNextAge:
        input.nineteenPaymentLifePremiumNextAge as number,
      netLevelPremium: input.netLevelPremium as number,
    }),
  description:
    "Calculate a Commissioners Reserve Valuation Method modified premium and prospective reserve for a level-premium policy from precomputed actuarial present values.",
  id: "actuarial/crvm-modified-reserve",
  inputs: [
    {
      description:
        "Present value of future policy benefits at the valuation date.",
      id: "benefitPresentValue",
      kind: "number",
      label: "Benefit present value",
      minimum: 0,
    },
    {
      description:
        "Net premium for one year of term insurance at the original issue age.",
      id: "firstYearTermPremium",
      kind: "number",
      label: "First-year term premium",
      minimum: 0,
    },
    {
      description:
        "Renewal premium produced by the full preliminary term method.",
      id: "fullPreliminaryTermRenewalPremium",
      kind: "number",
      label: "Full preliminary term renewal premium",
      minimum: 0,
    },
    {
      description:
        "Annuity-due factor for future valuation premiums at the valuation date.",
      id: "futurePremiumAnnuityFactor",
      kind: "number",
      label: "Future premium annuity factor",
      minimum: 0,
    },
    {
      description:
        "Net level premium for a 19-payment whole life policy issued one year after the original issue age.",
      id: "nineteenPaymentLifePremiumNextAge",
      kind: "number",
      label: "19-payment life premium at next age",
      minimum: 0,
    },
    {
      description: "Unmodified net level premium for the policy.",
      id: "netLevelPremium",
      kind: "number",
      label: "Net level premium",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Increase over the net level premium allowed by the Commissioners method.",
      id: "commissionersExpenseAllowance",
      kind: "number",
      label: "Commissioners expense allowance",
    },
    {
      description:
        "Annual modified valuation premium used in the prospective reserve.",
      id: "modifiedValuationPremium",
      kind: "number",
      label: "Modified valuation premium",
    },
    {
      description:
        "Prospective reserve: benefit present value less the present value of future modified premiums.",
      id: "valuationReserve",
      kind: "number",
      label: "Valuation reserve",
    },
  ],
  title: "CRVM Modified Reserve Calculator",
});

export const runCrvmModifiedReserve = crvmModifiedReserveTool.execute;
export default crvmModifiedReserveTool;
