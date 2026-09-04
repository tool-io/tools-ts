import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as valuation,
  example as valuationExample,
} from "../strike-price-409a-staleness-months-checker/tool.js";
import {
  calculate as assignment,
  example as assignmentExample,
} from "../ip-assignment-agreement-signed-checker/tool.js";
import {
  calculate as setup,
  example as setupExample,
} from "../ein-dba-bank-account-setup-order-checklist/tool.js";
import {
  calculate as split,
  example as splitExample,
} from "../razor-blade-model-recurring-consumable-split-lookup/tool.js";
import {
  calculate as economics,
  example as economicsExample,
} from "../franchise-vs-owned-unit-economics-compare-lookup/tool.js";
import {
  calculate as guardrail,
  example as guardrailExample,
} from "../north-star-guardrail-metrics-counterbalance-pairing/tool.js";
import {
  calculate as disclosure,
  example as disclosureExample,
} from "../billings-bookings-revenue-recognition-distinction/tool.js";
import {
  calculate as interview,
  example as interviewExample,
} from "../mom-test-rules-question-checker/tool.js";
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
  it("does not substitute a month for the named calendar-day election window", () => {
    const r = calculate({
      ...example.input,
      callerEligiblePropertyTransferDate: "2026-02-01",
      observedElectionSubmissionDate: "2026-03-03",
    });
    expect(r.callerElectionDeadline).toBe("2026-03-03");
    expect(r.signedDeadlineDaysRemaining).toBe(0);
  });
  it("rejects a nonexistent Gregorian election date", () => {
    expect(() =>
      calculate({
        ...example.input,
        callerEligiblePropertyTransferDate: "2026-02-29",
      }),
    ).toThrow();
  });
  it("counts completed valuation months at the supplied anniversary", () => {
    expect(
      valuation({
        ...valuationExample.input,
        observedGrantDate: "2026-01-15",
        independentMaterialEventSinceValuation: false,
      }).completedValuationAgeMonths,
    ).toBe(12);
  });
  it("retains material-event review before the elapsed-age boundary", () => {
    expect(
      valuation({
        ...valuationExample.input,
        observedGrantDate: "2025-01-16",
        independentMaterialEventSinceValuation: true,
      }).callerStalenessReview,
    ).toBe(true);
  });
  it("reports all required IP contributors when no verified assignments exist", () => {
    expect(
      assignment({
        ...assignmentExample.input,
        observedAssignmentContributorIds: [],
        callerIndependentlyVerifiedSignedScopeFlags: [],
      }).contributorsWithoutVerifiedAssignment,
    ).toEqual(["a", "b"]);
  });
  it("rejects contradictory empty-assignment verification flags", () => {
    expect(() =>
      assignment({
        ...assignmentExample.input,
        observedAssignmentContributorIds: [],
        callerIndependentlyVerifiedSignedScopeFlags: [1],
      }),
    ).toThrow();
  });
  it("does not certify unsigned assignment coverage", () => {
    expect(
      assignment({
        ...assignmentExample.input,
        callerIndependentlyVerifiedSignedScopeFlags: [0],
      }).contributorsWithoutVerifiedAssignment,
    ).toEqual(["a", "b"]);
  });
  it("rejects cyclic setup prerequisites even when all steps are marked completed", () => {
    expect(() =>
      setup({
        ...setupExample.input,
        callerSetupOrderPrerequisiteEdges: [
          [0, 1],
          [1, 2],
          [2, 0],
        ],
        observedSetupOrderCompletedFlags: [1, 1, 1],
      }),
    ).toThrow();
  });
  it("permits an explicit empty dependency graph without inventing a setup order", () => {
    expect(
      setup({ ...setupExample.input, callerSetupOrderPrerequisiteEdges: [] })
        .missingPrerequisiteStepIds,
    ).toEqual([]);
  });
  it("uses exact half-unit basis-point rounding", () => {
    expect(
      split({
        ...splitExample.input,
        observedDurableProductRevenueMinor: 19999,
        observedRecurringConsumableRevenueMinor: 1,
      }).consumableRevenueBasisPoints,
    ).toBe(1);
  });
  it("refuses overflowing exact aggregate revenue", () => {
    expect(() =>
      split({
        ...splitExample.input,
        observedDurableProductRevenueMinor: Number.MAX_SAFE_INTEGER,
        observedRecurringConsumableRevenueMinor: 1,
      }),
    ).toThrow();
  });
  it("retains negative unit contribution", () => {
    expect(
      economics({
        ...economicsExample.input,
        callerFranchiseOperatingCostMinor: 120,
      }).franchiseContributionMinor,
    ).toBe(-40);
  });
  it("does not erase a guardrail violation when north-star target is reached", () => {
    const r = guardrail({
      ...guardrailExample.input,
      knownGuardrailFlags: [1, 1],
    });
    expect(r.northStarTargetReached).toBe(true);
    expect(r.knownGuardrailViolationIndices).toEqual([1]);
  });
  it("keeps negative bookings/billings discrepancies instead of inventing balances", () => {
    expect(
      disclosure({
        ...disclosureExample.input,
        observedRecognizedRevenueMinor: 100,
      }).signedBilledUnrecognizedGapMinor,
    ).toBe(-20);
  });
  it("uses independently annotated interview features, not string matching question text", () => {
    expect(
      interview({
        ...interviewExample.input,
        askedAboutSpecificPastBehaviorFlags: [0, 1],
        containsLeadingComplimentPromptFlags: [0, 0],
        requestsHypotheticalPurchaseFlags: [0, 0],
      }).callerInterviewQuestionReviewIds,
    ).toEqual(["q1"]);
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
    const input = {
      ...example.input,
      observedElectionSubmissionDate: "2025-01-01",
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      observedElectionSubmissionDate: "2026-02-01",
    };
    close(calculate(input), {
      callerElectionDeadline: "2026-01-31",
      signedDeadlineDaysRemaining: -1,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        callerElectionDeadline: "2026-01-31",
        signedDeadlineDaysRemaining: -1,
      });
  });
});
