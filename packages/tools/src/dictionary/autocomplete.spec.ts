import { describe, expect, it } from "vitest";
import {
  createDictionaryAutocompleteIndex,
  parseDictionaryAutocompleteIndex,
  suggestDictionaryTerms,
} from "./autocomplete.js";

const index = createDictionaryAutocompleteIndex({
  capability: "translation",
  datasetId: "dictionary/test",
  datasetVersion: "1",
  sourceLanguage: "en",
  targetLanguage: "de",
  terms: ["House", "cat", "catalog", "cater", "dog", " CAT "],
});

describe("dictionary autocomplete", () => {
  it("normalizes, deduplicates, and sorts terms", () => {
    expect(index.terms).toEqual([
      ["cat", "CAT"],
      ["catalog", "catalog"],
      ["cater", "cater"],
      ["dog", "dog"],
      ["house", "House"],
    ]);
  });

  it("finds a bounded prefix range with binary search", () => {
    expect(suggestDictionaryTerms(index, "CAT", 2)).toEqual(["CAT", "catalog"]);
  });

  it("returns an empty list for empty input and misses", () => {
    expect(suggestDictionaryTerms(index, "")).toEqual([]);
    expect(suggestDictionaryTerms(index, "zebra")).toEqual([]);
  });

  it("validates indexes at a data boundary", () => {
    expect(parseDictionaryAutocompleteIndex(index)).toEqual(index);
    expect(
      parseDictionaryAutocompleteIndex({
        ...index,
        terms: [...index.terms].reverse(),
      }),
    ).toBeNull();
    expect(
      parseDictionaryAutocompleteIndex({
        ...index,
        capability: "synonym",
      }),
    ).toBeNull();
  });

  it("never returns more than fifty suggestions", () => {
    const largeIndex = createDictionaryAutocompleteIndex({
      capability: "synonym",
      datasetId: "dictionary/test-relations",
      datasetVersion: "1",
      sourceLanguage: "en",
      terms: Array.from(
        { length: 75 },
        (_, number) => `word-${String(number).padStart(2, "0")}`,
      ),
    });

    expect(suggestDictionaryTerms(largeIndex, "word", 100)).toHaveLength(50);
  });
});
