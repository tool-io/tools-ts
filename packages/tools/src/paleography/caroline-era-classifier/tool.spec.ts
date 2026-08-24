import { describe, expect, it } from "vitest";
import {
  carolineEraClassifierExample,
  runCarolineEraClassifier,
} from "./tool.js";

describe("caroline-era-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCarolineEraClassifier(carolineEraClassifierExample.input),
    ).toEqual({
      ok: true,
      output: carolineEraClassifierExample.output,
    });
  });

  it("marks the twelfth century as transitional", () => {
    const result = runCarolineEraClassifier({ century: 12 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.eraBand as string).toBe("transitional_to_gothic");
    expect(result.output.classicFloruitCentury as boolean).toBe(false);
  });

  it("rejects non-positive centuries", () => {
    expect(runCarolineEraClassifier({ century: 0 }).ok).toBe(false);
  });
});
