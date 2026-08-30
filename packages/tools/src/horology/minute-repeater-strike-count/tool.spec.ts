import { describe, expect, it } from "vitest";
import {
  mapMinuteRepeaterStrikeSequence,
  minuteRepeaterSequenceExample,
  runMinuteRepeaterSequence,
} from "./tool.js";

describe("minute repeater strike sequence", () => {
  it("reproduces the canonical example", () => {
    expect(
      runMinuteRepeaterSequence(minuteRepeaterSequenceExample.input),
    ).toEqual({
      ok: true,
      output: minuteRepeaterSequenceExample.output,
    });
  });

  it("independently reproduces the published maximum at 12:59", () => {
    expect(mapMinuteRepeaterStrikeSequence({ hour: 12, minute: 59 })).toEqual({
      hourStrikes: 12,
      minuteStrikes: 14,
      quarterStrikePairs: 3,
      totalStrikes: 32,
    });
  });

  it("counts a quarter as one high-low pair", () => {
    expect(
      mapMinuteRepeaterStrikeSequence({ hour: 3, minute: 15 }).totalStrikes,
    ).toBe(5);
  });

  it("counts midnight as no strikes", () => {
    expect(
      mapMinuteRepeaterStrikeSequence({ hour: 12, minute: 0 }).totalStrikes,
    ).toBe(12);
  });

  it.each([
    [{ hour: 0, minute: 0 }, "hour"],
    [{ hour: 13, minute: 0 }, "hour"],
    [{ hour: 1, minute: 60 }, "minute"],
  ] as const)("rejects invalid input %o", (input, field) => {
    expect(runMinuteRepeaterSequence(input)).toMatchObject({
      error: { issues: [{ field }] },
      ok: false,
    });
  });
});
