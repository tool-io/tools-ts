import { describe, expect, it } from "vitest";
import {
  calculateTimestampToSecondsConverter,
  runTimestampToSecondsConverter,
  timestampToSecondsConverterExample,
} from "./tool.js";

describe("archival-studies/timestamp-to-seconds-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTimestampToSecondsConverter(timestampToSecondsConverterExample.input),
    ).toEqual({ ok: true, output: timestampToSecondsConverterExample.output });
  });

  it("converts a sub-minute offset correctly", () => {
    const result = calculateTimestampToSecondsConverter({
      timestamp: "00:00:59",
    });
    expect(result.seconds).toBe(59);
  });

  it("rejects out-of-range minutes and seconds", () => {
    expect(runTimestampToSecondsConverter({ timestamp: "01:60:00" }).ok).toBe(
      false,
    );
    expect(runTimestampToSecondsConverter({ timestamp: "1:23" }).ok).toBe(
      false,
    );
  });
});
