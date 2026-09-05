import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as un,
  example as unExample,
} from "../un-official-six-languages-checker/tool.js";
import {
  calculate as speakers,
  example as speakerExample,
} from "../speakers-per-language-millions-lookup/tool.js";
import {
  calculate as countries,
  example as countryExample,
} from "../official-language-countries-count-lookup/tool.js";
import { calculate as cases } from "../finnish-fifteen-cases-table-lookup/tool.js";
import { calculate as cantonese } from "../cantonese-nine-tones-lookup/tool.js";
import { calculate as unicode } from "../unicode-block-range-for-script-lookup/tool.js";
import {
  calculate as inventory,
  example as inventoryExample,
} from "../alphabet-size-by-language-lookup/tool.js";
import {
  calculate as family,
  example as familyExample,
} from "../sign-language-family-lookup/tool.js";
import {
  calculate as etymology,
  example as etymologyExample,
} from "../cognate-vs-loanword-classifier/tool.js";
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
  it("retains competition ranks at tied twentieth place", () => {
    const ids = Array.from({ length: 21 }, (_, i) => `language-${i}`),
      counts = ids.map((_, i) => (i < 19 ? 100 - i : 1));
    const r = calculate({
      ...example.input,
      callerSameYearDefinitionLanguageIds: ids,
      callerMatchedSpeakerCounts: counts,
    });
    expect(r.competitionRanks.slice(-2)).toEqual([20, 20]);
    expect(r.withinTopTwentyFlags.slice(-2)).toEqual([1, 1]);
  });
  it("does not assign dense ranks to a competition ranking", () => {
    expect(
      calculate({ ...example.input, callerMatchedSpeakerCounts: [2, 2, 1] })
        .competitionRanks,
    ).toEqual([1, 1, 3]);
  });
  it("does not case-fold language codes implicitly", () => {
    expect(() =>
      un({ ...unExample.input, languageIso6391Codes: ["EN"] }),
    ).toThrow();
  });
  it("checks explicit Chinese macro-language code without inferring dialect identity", () => {
    expect(
      un({ ...unExample.input, languageIso6391Codes: ["zh", "ja"] })
        .unOfficialLanguageFlags,
    ).toEqual([1, 0]);
  });
  it("refuses speaker aggregation without independent nonoverlap evidence", () => {
    expect(() =>
      speakers({
        ...speakerExample.input,
        callerDisjointPopulationDefinitionVerified: false,
      }),
    ).toThrow();
  });
  it("refuses an overflowing exact aggregate speaker count", () => {
    expect(() =>
      speakers({
        ...speakerExample.input,
        callerDocumentedNativeSpeakers: Number.MAX_SAFE_INTEGER,
        callerDocumentedAdditionalNonNativeSpeakers: 1,
      }),
    ).toThrow();
  });
  it("does not treat unknown official-language status as confirmed absence", () => {
    const r = countries({
      ...countryExample.input,
      callerKnownStatusFlags: [0, 0, 0],
    });
    expect(r.knownOfficialCount).toBe(0);
    expect(r.unverifiedJurisdictionIds).toEqual(["a", "b", "c"]);
  });
  it("does not double count duplicate jurisdiction identities", () => {
    expect(() =>
      countries({
        ...countryExample.input,
        callerJurisdictionIds: ["a", "a", "c"],
      }),
    ).toThrow();
  });
  it("rejects prototype keys in built-in language descriptor tables", () => {
    expect(() => cases({ finnishCase: "constructor" })).toThrow();
  });
  it("distinguishes traditional checked Cantonese tones from separate pitch categories", () => {
    expect(cantonese({ traditionalCantoneseTone: "9" }).meaning).toContain(
      "category6",
    );
  });
  it("reports selected Greek block ranges without claiming all block characters are Greek letters", () => {
    expect(
      unicode({ scriptGroup: "Greek" }).selectedBlockRangesDecimal,
    ).toEqual([
      [880, 1023],
      [7936, 8191],
    ]);
  });
  it("counts explicit multigraph alphabet tokens as one declared letter", () => {
    expect(
      inventory({
        ...inventoryExample.input,
        callerVerifiedAlphabetLetterInventory: ["a", "ch", "ll"],
      }).declaredDistinctInventoryCount,
    ).toBe(3);
  });
  it("does not substitute a language family guess for an absent verified reference key", () => {
    expect(() =>
      family({
        ...familyExample.input,
        querySignFamilyKey: "unverified-region",
      }),
    ).toThrow();
  });
  it("retains uncertain inheritance and borrowing candidates until evidence is known", () => {
    expect(
      etymology({
        ...etymologyExample.input,
        knownEtymologyRelationFlags: [0, 0],
      }).compatibleCallerClasses,
    ).toEqual(["a", "b"]);
    expect(
      etymology({
        ...etymologyExample.input,
        knownEtymologyRelationFlags: [0, 0],
      }).fullyWitnessedCallerClasses,
    ).toEqual([]);
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
      callerMatchedSpeakerCounts: [-1, 50, 50],
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, callerMatchedSpeakerCounts: [1, 1, 1] };
    close(calculate(input), {
      competitionRanks: [1, 1, 1],
      withinTopTwentyFlags: [1, 1, 1],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        competitionRanks: [1, 1, 1],
        withinTopTwentyFlags: [1, 1, 1],
      });
  });
});
