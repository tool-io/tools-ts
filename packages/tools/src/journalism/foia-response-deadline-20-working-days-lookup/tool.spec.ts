import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as embargo,
  example as embargoExample,
} from "../embargo-lift-datetime-zone-converter/tool.js";
import {
  calculate as months,
  example as monthExample,
} from "../ap-style-month-abbreviation-rules-lookup/tool.js";
import {
  calculate as numerals,
  example as numeralExample,
} from "../ap-style-numerals-vs-words-selector-lookup/tool.js";
import {
  calculate as fog,
  example as fogExample,
} from "../gunning-fog-index-bulk-calculation/tool.js";
import {
  calculate as passive,
  example as passiveExample,
} from "../passive-voice-percent-sentences-detector/tool.js";
import {
  calculate as reply,
  example as replyExample,
} from "../right-of-reply-comment-request-window-lookup/tool.js";
import {
  calculate as explainer,
  example as explainerExample,
} from "../what-we-know-dont-know-rolling-explainer-format-template/tool.js";
import {
  calculate as agate,
  example as agateExample,
} from "../pica-agate-line-depth-measure-converter/tool.js";
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
  it("refuses a working-day deadline beyond the four-digit Gregorian year range", () => {
    expect(() =>
      calculate({
        ...example.input,
        callerEligibleReceiptDate: "9999-12-31",
        callerApplicableWorkingDayWindow: 1,
        callerVerifiedExcludedFederalHolidayDates: [],
      }),
    ).toThrow();
  });
  it("starts the working-day count after eligible receipt and skips weekends", () => {
    expect(
      calculate({
        ...example.input,
        callerEligibleReceiptDate: "2026-01-02",
        callerApplicableWorkingDayWindow: 1,
        callerVerifiedExcludedFederalHolidayDates: [],
      }).callerWorkingDayResponseDeadline,
    ).toBe("2026-01-05");
  });
  it("uses caller independently verified holidays rather than fabricating a federal calendar", () => {
    expect(
      calculate({
        ...example.input,
        callerApplicableWorkingDayWindow: 1,
        callerVerifiedExcludedFederalHolidayDates: ["2026-01-05"],
      }).callerWorkingDayResponseDeadline,
    ).toBe("2026-01-06");
  });
  it("does not count a duplicated holiday twice", () => {
    expect(() =>
      calculate({
        ...example.input,
        callerVerifiedExcludedFederalHolidayDates: ["2026-01-19", "2026-01-19"],
      }),
    ).toThrow();
  });
  it("converts the embargo instant across midnight with an explicit fixed offset", () => {
    expect(embargo(embargoExample.input).fixedOffsetLocalEmbargo).toBe(
      "2026-01-02T01:30:00",
    );
  });
  it("refuses impossible UTC timestamps rather than accepting Date normalization", () => {
    expect(() =>
      embargo({
        ...embargoExample.input,
        callerEmbargoUtc: "2026-02-30T00:00:00Z",
      }),
    ).toThrow();
  });
  it("keeps May unabbreviated even with a specific date", () => {
    expect(
      months({ ...monthExample.input, monthOneBased: 5 }).basicApMonthToken,
    ).toBe("May");
  });
  it("uses explicit number context for the age exception", () => {
    expect(numerals(numeralExample.input).basicApRenderedNumber).toBe("7");
    expect(
      numerals({ ...numeralExample.input, callerContext: "general" })
        .basicApRenderedNumber,
    ).toBe("seven");
  });
  it("pools bulk Fog exposures rather than averaging document indices", () => {
    const r = fog({
      ...fogExample.input,
      observedDocumentWords: [100, 900],
      observedDocumentSentenceCounts: [10, 30],
      independentlyFogEligibleComplexWordCounts: [0, 90],
    });
    expect(r.pooledGunningFogIndex).toBeCloseTo(13.6);
  });
  it("excludes unknown syntactic analyses from passive-voice percentage", () => {
    const r = passive(passiveExample.input);
    expect(r.knownPassiveSentencePercent).toBe(50);
    expect(r.unknownSentenceAnalysisIndices).toEqual([2]);
  });
  it("retains negative right-of-reply policy reserve without claiming legal clearance", () => {
    expect(
      reply({
        ...replyExample.input,
        plannedPublicationUtc: "2026-01-01T10:30:00Z",
      }).signedCallerWindowReserveSeconds,
    ).toBe(-1800);
  });
  it("preserves disputed and unknown claims instead of merging them into confirmed facts", () => {
    const r = explainer(explainerExample.input);
    expect(r.knownClaimTexts).toEqual(["confirmed record"]);
    expect(r.disputedClaimTexts).toEqual(["disputed accounts"]);
    expect(r.unknownClaimTexts).toEqual(["pending confirmation"]);
  });
  it("converts six picas per inch to fourteen nominal agate lines per inch", () => {
    expect(
      agate({ ...agateExample.input, observedColumnDepthPicas: 6 })
        .traditionalAgateLineDepth,
    ).toBe(14);
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
    const input = { ...example.input, callerEligibleReceiptDate: "2026-02-30" };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, callerApplicableWorkingDayWindow: 0 };
    close(calculate(input), { callerWorkingDayResponseDeadline: "2026-01-02" });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, { callerWorkingDayResponseDeadline: "2026-01-02" });
  });
});
