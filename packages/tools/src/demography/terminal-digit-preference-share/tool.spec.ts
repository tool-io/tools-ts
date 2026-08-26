import { describe, expect, it } from "vitest";
import {
  calculateTerminalDigitPreferenceShare,
  runTerminalDigitPreferenceShare,
  terminalDigitPreferenceShareExample,
} from "./tool.js";

describe("demography/terminal-digit-preference-share", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTerminalDigitPreferenceShare(
        terminalDigitPreferenceShareExample.input,
      ),
    ).toEqual({ ok: true, output: terminalDigitPreferenceShareExample.output });
  });

  it("reports a five-heaping share against uniform expectation", () => {
    const result = calculateTerminalDigitPreferenceShare({
      reportedAges: [25, 26, 27, 28, 29],
      terminalDigit: 5,
    });
    expect(result.countAtDigit).toBe(1);
    expect(result.sharePercent).toBe(20);
    expect(result.deviationFromUniformPoints).toBe(10);
  });

  it("rejects bad ages and out-of-range digits", () => {
    expect(
      runTerminalDigitPreferenceShare({ reportedAges: [], terminalDigit: 0 })
        .ok,
    ).toBe(false);
    expect(
      runTerminalDigitPreferenceShare({
        reportedAges: [30.5],
        terminalDigit: 0,
      }).ok,
    ).toBe(false);
    expect(
      runTerminalDigitPreferenceShare({ reportedAges: [30], terminalDigit: 10 })
        .ok,
    ).toBe(false);
  });
});
