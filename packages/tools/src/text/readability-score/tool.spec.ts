import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateReadabilityScore,
  readabilityScoreExample,
  readabilityScoreTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateReadabilityScore>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Readability Score", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = readabilityScoreTool.execute(readabilityScoreExample.input);
    expect(result).toEqual({ ok: true, output: readabilityScoreExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(readabilityScoreTool.id).toBe("text/readability-score");
    expect(validateToolContract(readabilityScoreTool)).toEqual([]);
  });

  it("scores polysyllabic prose as harder than the example", () => {
    const result = calculateReadabilityScore({
      text: "Extraordinary documentation facilitates organizational comprehensibility.",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.wordCount).toBe(5);
      expect(result.output.syllableCount).toBeGreaterThan(
        readabilityScoreExample.output.syllableCount,
      );
      expect(result.output.fleschReadingEase).toBeLessThan(
        readabilityScoreExample.output.fleschReadingEase,
      );
    }
  });

  it("treats punctuation-free text as one sentence", () => {
    const result = calculateReadabilityScore({
      text: "just some words here",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.sentenceCount).toBe(1);
      expect(result.output.wordCount).toBe(4);
    }
  });

  it("rejects missing, empty, and non-string text", () => {
    expect(calculateReadabilityScore(null).ok).toBe(false);
    expect(issueCodes(calculateReadabilityScore({}))).toEqual([
      "text_required",
    ]);
    expect(issueCodes(calculateReadabilityScore({ text: "   " }))).toEqual([
      "text_empty",
    ]);
    expect(issueCodes(calculateReadabilityScore({ text: 42 }))).toEqual([
      "text_invalid",
    ]);
    expect(issueCodes(calculateReadabilityScore({ extra: 1, text: "ok" }))).toEqual([
      "unknown_field",
    ]);
  });
});
