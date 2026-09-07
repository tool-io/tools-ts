import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as gifts,
  example as giftExample,
} from "../gift-tax-annual-exclusion-count-checker/tool.js";
import {
  calculate as accounts,
  example as accountExample,
} from "../fbar-fatca-aggregate-threshold-checker/tool.js";
import {
  calculate as hifo,
  example as hifoExample,
} from "../crypto-cost-basis-method-hifo-comparison/tool.js";
import {
  calculate as steps,
  example as stepExample,
} from "../child-tax-credit-phaseout-magi-checker/tool.js";
import {
  calculate as presence,
  example as presenceExample,
} from "../permanent-establishment-days-nexus-checker/tool.js";
import {
  calculate as margin,
  example as marginExample,
} from "../margin-scheme-secondhand-vat-base/tool.js";
import {
  calculate as sepp,
  example as seppExample,
} from "../sepp-72t-substantially-equal-payment-calculator/tool.js";
import {
  calculate as wash,
  example as washExample,
} from "../wash-sale-rule-30-day-flag-checker/tool.js";
import {
  calculate as inheritance,
  example as inheritanceExample,
} from "../step-up-basis-at-death-checker/tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("rounds the incremental stacked-tax numerator once, not two rounded totals", () => {
    expect(
      calculate({
        ...example.input,
        ordinaryTaxableIncomeMinor: 1,
        eligibleCapitalGainMinor: 1,
        callerBracketStartsMinor: [0],
        callerCapitalRateBasisPoints: [5000],
      }).stackedCapitalGainTaxMinor,
    ).toBe(1);
  });
  it("uses exact large safe monetary amounts", () => {
    expect(
      calculate({
        ...example.input,
        ordinaryTaxableIncomeMinor: 0,
        eligibleCapitalGainMinor: Number.MAX_SAFE_INTEGER,
        callerBracketStartsMinor: [0],
        callerCapitalRateBasisPoints: [10000],
      }).stackedCapitalGainTaxMinor,
    ).toBe(Number.MAX_SAFE_INTEGER);
  });
  it("refuses a combined monetary stack beyond safe integers", () => {
    expect(() =>
      calculate({
        ...example.input,
        ordinaryTaxableIncomeMinor: Number.MAX_SAFE_INTEGER,
        eligibleCapitalGainMinor: 1,
      }),
    ).toThrow();
  });
  it("does not confuse inclusive secondhand-margin VAT with rate times margin", () => {
    expect(
      margin({
        ...marginExample.input,
        eligibleSecondhandSaleMinor: 1200,
        eligiblePurchaseMinor: 600,
        callerVatBasisPoints: 2000,
      }).positiveMarginVatMinor,
    ).toBe(100);
  });
  it("does not pool separate recipients before applying annual exclusions", () => {
    expect(
      gifts({
        ...giftExample.input,
        callerAggregatedRecipientGiftsMinor: [60, 60],
      }).totalAboveExclusionMinor,
    ).toBe(0);
  });
  it("does not add noncontemporaneous account maxima", () => {
    expect(
      accounts({
        ...accountExample.input,
        observedSameDateForeignAccountBalancesMinor: [
          [100, 0],
          [0, 100],
        ],
      }).observedMaximumSameDateAggregateMinor,
    ).toBe(100);
  });
  it("applies each started MAGI step including the first partial step", () => {
    expect(
      steps({ ...stepExample.input, magiMinor: 101 }).startedPhaseoutSteps,
    ).toBe(1);
    expect(
      steps({ ...stepExample.input, magiMinor: 110 }).startedPhaseoutSteps,
    ).toBe(1);
    expect(
      steps({ ...stepExample.input, magiMinor: 111 }).startedPhaseoutSteps,
    ).toBe(2);
  });
  it("deduplicates nested and touching PE presence intervals", () => {
    expect(
      presence({
        ...presenceExample.input,
        observedPresenceStartDayOffsets: [0, 2, 10],
        observedPresenceEndDayOffsetsExclusive: [10, 5, 20],
      }).uniqueObservedPresenceDays,
    ).toBe(20);
  });
  it("keeps signed crypto losses", () => {
    expect(
      hifo({ ...hifoExample.input, netDisposalProceedsMinor: 1 }).hifoGainMinor,
    ).toBe(-49);
  });
  it("keeps stable chronological HIFO ties", () => {
    expect(
      hifo({
        ...hifoExample.input,
        callerLotCostPerUnitMinor: [10, 10],
        disposalUnitCount: 1,
      }).hifoUsedLotUnits,
    ).toEqual([1, 0]);
  });
  it("refuses overflowing lot bases rather than losing monetary units", () => {
    expect(() =>
      hifo({
        ...hifoExample.input,
        callerLotCostPerUnitMinor: [
          Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ],
      }),
    ).toThrow();
  });
  it("computes exact finite-rate annual SEPP amortization", () => {
    expect(
      sepp({
        ...seppExample.input,
        accountBalanceMinor: 210,
        callerIndependentInterestBasisPoints: 1000,
        callerPaymentYears: 2,
      }).conditionalSeppPaymentMinor,
    ).toBe(121);
  });
  it("checks both named wash-sale endpoints and invalid Gregorian dates", () => {
    const r = wash({
      ...washExample.input,
      replacementAcquisitionDates: ["2026-01-30", "2026-03-31"],
    });
    expect(r.signedReplacementOffsetsDays).toEqual([-30, 30]);
    expect(r.namedThirtyDayCandidateIndices).toEqual([0, 1]);
    expect(() =>
      wash({ ...washExample.input, lossSaleDate: "2026-02-29" }),
    ).toThrow();
  });
  it("retains signed inherited basis step-downs and negative half-unit rounding", () => {
    expect(
      inheritance({
        ...inheritanceExample.input,
        priorEligibleBasisMinor: 1,
        callerApplicableDeathValuationMinor: 0,
        callerInheritedFractionBasisPoints: 5000,
      }).signedBasisAdjustmentMinor,
    ).toBe(-1);
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds evidence and refuses inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("rejects invalid domains", () => {
    const input = { ...example.input, callerBracketStartsMinor: [1, 100] };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, eligibleCapitalGainMinor: 0 };
    close(calculate(input), {
      stackedCapitalGainTaxMinor: 0,
      signedTotalStackMinor: 80,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        stackedCapitalGainTaxMinor: 0,
        signedTotalStackMinor: 80,
      });
  });
});
