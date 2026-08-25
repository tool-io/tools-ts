import { describe, expect, it } from "vitest";
import {
  germtubeAlbicansFlagCheckerExample,
  runGermtubeAlbicansFlagChecker,
} from "./tool.js";

describe("Germ Tube Flag", () => {
  it("matches the canonical example", () =>
    expect(
      runGermtubeAlbicansFlagChecker(germtubeAlbicansFlagCheckerExample.input),
    ).toEqual({
      ok: true,
      output: germtubeAlbicansFlagCheckerExample.output,
    }));
  it("flags presumptive albicans or dubliniensis when a germ tube is present", () =>
    expect(runGermtubeAlbicansFlagChecker({ germTubePresent: true })).toEqual({
      ok: true,
      output: {
        albicansOrDubliniensisPresumptive: true,
        germTubePresent: true,
        interpretation:
          "A germ tube was observed; Candida albicans or Candida dubliniensis is presumptive, and confirmatory identification is required.",
      },
    }));
  it("does not flag when no germ tube is seen", () =>
    expect(runGermtubeAlbicansFlagChecker({ germTubePresent: false })).toEqual({
      ok: true,
      output: {
        albicansOrDubliniensisPresumptive: false,
        germTubePresent: false,
        interpretation:
          "No germ tube was observed; this result alone does not identify or exclude a Candida species.",
      },
    }));
  it("keeps the flag equal to the observation", () => {
    for (const germTubePresent of [true, false]) {
      const result = runGermtubeAlbicansFlagChecker({ germTubePresent });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.albicansOrDubliniensisPresumptive).toBe(
          result.output.germTubePresent,
        );
    }
  });
  it("is stable across repeat runs", () => {
    const first = runGermtubeAlbicansFlagChecker({ germTubePresent: true });
    const second = runGermtubeAlbicansFlagChecker({ germTubePresent: true });
    expect(first).toEqual(second);
  });
  it("rejects non-boolean observations", () =>
    expect(runGermtubeAlbicansFlagChecker({ germTubePresent: "yes" }).ok).toBe(
      false,
    ));
});
