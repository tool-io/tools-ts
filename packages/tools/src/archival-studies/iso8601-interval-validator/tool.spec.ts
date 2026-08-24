import { describe, expect, it } from "vitest";
import {
  calculateIso8601IntervalValidator,
  iso8601IntervalValidatorExample,
  runIso8601IntervalValidator,
} from "./tool.js";

describe("archival-studies/iso8601-interval-validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIso8601IntervalValidator(iso8601IntervalValidatorExample.input),
    ).toEqual({ ok: true, output: iso8601IntervalValidatorExample.output });
  });

  it("accepts date/duration mixes and rejects duration-only intervals", () => {
    expect(
      calculateIso8601IntervalValidator({ interval: "PT6H/2020-01-01T00:00Z" }),
    ).toMatchObject({
      valid: true,
      startKind: "duration",
      endKind: "datetime",
    });
    expect(
      calculateIso8601IntervalValidator({ interval: "P1Y/P2Y" }).valid,
    ).toBe(false);
  });

  it("reports malformed endpoints and rejects empty input", () => {
    expect(
      calculateIso8601IntervalValidator({ interval: "1876-13-02/1999" }).reason,
    ).toContain("not a valid");
    expect(runIso8601IntervalValidator({ interval: "" }).ok).toBe(false);
  });
});
