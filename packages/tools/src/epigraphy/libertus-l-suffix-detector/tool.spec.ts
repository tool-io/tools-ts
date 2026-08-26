import { describe, expect, it } from "vitest";
import {
  libertusLSuffixDetectorExample,
  runLibertusLSuffixDetector,
} from "./tool.js";

describe("libertus-l-suffix-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLibertusLSuffixDetector(libertusLSuffixDetectorExample.input),
    ).toEqual({
      ok: true,
      output: libertusLSuffixDetectorExample.output,
    });
  });

  it("returns -1 when no marker present", () => {
    const r = runLibertusLSuffixDetector({
      nameTokens: ["Gaius", "Iulius", "Caesar"],
    });
    expect(
      r.ok &&
        !r.output.libertusMarker &&
        (r.output.markerIndex as number) === -1,
    ).toBe(true);
  });
  it("rejects null input", () => {
    expect(runLibertusLSuffixDetector(null).ok).toBe(false);
  });
});
