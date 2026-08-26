import { describe, expect, it } from "vitest";
import {
  patronymicLyticSuffixDetectorExample,
  runPatronymicLyticSuffixDetector,
} from "./tool.js";

describe("patronymic-lytic-suffix-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPatronymicLyticSuffixDetector(
        patronymicLyticSuffixDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: patronymicLyticSuffixDetectorExample.output,
    });
  });

  it("detects the idas variant case-insensitively", () => {
    expect(runPatronymicLyticSuffixDetector({ name: "leonidas" })).toEqual({
      ok: true,
      output: { hasPatronymicSuffix: true, matchedSuffix: "idas" },
    });
  });
  it("rejects short stems and empty names", () => {
    expect(runPatronymicLyticSuffixDetector({ name: "Ides" })).toEqual({
      ok: true,
      output: { hasPatronymicSuffix: false, matchedSuffix: "" },
    });
    expect(runPatronymicLyticSuffixDetector({ name: "" }).ok).toBe(false);
  });
});
