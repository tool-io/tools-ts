import { describe, expect, it } from "vitest";
import {
  honorificBaseMarkerCheckerExample,
  runHonorificBaseMarkerChecker,
} from "./tool.js";

describe("honorific-base-marker-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHonorificBaseMarkerChecker(honorificBaseMarkerCheckerExample.input),
    ).toEqual({
      ok: true,
      output: honorificBaseMarkerCheckerExample.output,
    });
  });

  it("counts a lone token as low and adds the dative bonus", () => {
    const lone = runHonorificBaseMarkerChecker({ formulaWords: ["Honori"] });
    if (!lone.ok) throw new Error("expected success");
    expect(lone.output.classification as string).toBe("honorific-low");
    const boosted = runHonorificBaseMarkerChecker({
      formulaWords: ["Honori"],
      hasDativeDedicatee: true,
    });
    if (!boosted.ok) throw new Error("expected success");
    expect(boosted.output.classification as string).toBe("honorific-high");
  });
  it("reports not-honorific without markers and rejects blank words", () => {
    expect(
      runHonorificBaseMarkerChecker({ formulaWords: ["Dis", "Manibus"] }),
    ).toEqual({
      ok: true,
      output: {
        markerScore: 0,
        classification: "not-honorific",
        matchedMarkers: [],
      },
    });
    expect(runHonorificBaseMarkerChecker({ formulaWords: [" "] }).ok).toBe(
      false,
    );
    expect(runHonorificBaseMarkerChecker({ formulaWords: ["Ob"] })).toEqual({
      ok: true,
      output: {
        markerScore: 0,
        classification: "not-honorific",
        matchedMarkers: [],
      },
    });
  });
});
