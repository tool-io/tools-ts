import { describe, expect, it } from "vitest";
import {
  calculateStretchWrapFilmLengthNeeded,
  stretchWrapFilmLengthNeededExample,
  runStretchWrapFilmLengthNeeded,
} from "./tool.js";

describe("stretch-wrap-film-length-needed", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStretchWrapFilmLengthNeeded(stretchWrapFilmLengthNeededExample.input),
    ).toEqual({
      ok: true,
      output: stretchWrapFilmLengthNeededExample.output,
    });
  });

  it("uses raw path length with no elongation", () => {
    const result = runStretchWrapFilmLengthNeeded({
      loadLengthM: 1.2,
      loadWidthM: 1,
      wrapRevolutions: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.unstretchedFilmLengthM as number).toBe(
      52.800000000000004,
    );
  });
  it("rejects non-positive revolutions", () => {
    expect(
      runStretchWrapFilmLengthNeeded({
        loadLengthM: 1.2,
        loadWidthM: 1,
        wrapRevolutions: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite dimensions and overflowing paths", () => {
    expect(() =>
      calculateStretchWrapFilmLengthNeeded({
        loadLengthM: Number.NaN,
        loadWidthM: 1,
        wrapRevolutions: 1,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateStretchWrapFilmLengthNeeded({
        loadLengthM: Number.MAX_VALUE,
        loadWidthM: Number.MAX_VALUE,
        wrapRevolutions: 1,
      }),
    ).toThrow("outside the representable range");
  });
});
