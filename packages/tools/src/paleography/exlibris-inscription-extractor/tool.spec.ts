import { describe, expect, it } from "vitest";
import {
  exlibrisInscriptionExtractorExample,
  runExlibrisInscriptionExtractor,
} from "./tool.js";

describe("exlibris-inscription-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runExlibrisInscriptionExtractor(
        exlibrisInscriptionExtractorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: exlibrisInscriptionExtractorExample.output,
    });
  });

  it("handles the English phrase form", () => {
    const result = runExlibrisInscriptionExtractor({
      inscription: "From the library of Sir Thomas Bodley, 1602.",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.containsExlibrisPhrase).toBe(true);
    expect(result.output.ownerText).toBe("Sir Thomas Bodley, 1602");
    expect(result.output.detectedYear).toBe(1602);
  });

  it("rejects empty inscriptions", () => {
    expect(runExlibrisInscriptionExtractor({ inscription: "   " }).ok).toBe(
      false,
    );
  });

  it("does not extract four digits from a longer number", () => {
    const result = runExlibrisInscriptionExtractor({
      inscription: "Ex libris Archive 12000",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.yearFound).toBe(false);
    expect(result.output.detectedYear).toBe(0);
  });

  it("returns the first valid year rather than stopping at an invalid number", () => {
    const result = runExlibrisInscriptionExtractor({
      inscription: "Ex libris shelf 123, acquired 1520",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.detectedYear).toBe(1520);
  });

  it("does not match an ownership phrase inside a larger word", () => {
    const result = runExlibrisInscriptionExtractor({
      inscription: "The label says pseudoexlibris 1520",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.containsExlibrisPhrase).toBe(false);
    expect(result.output.ownerText).toBe("");
  });
});
