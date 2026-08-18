import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateFormatDuration,
  formatDurationExample,
  formatDurationTool,
} from "./tool.js";

describe("Duration Formatter", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = formatDurationTool.execute(formatDurationExample.input);
    expect(result).toEqual({ ok: true, output: formatDurationExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(formatDurationTool.id).toBe("format/duration");
    expect(validateToolContract(formatDurationTool)).toEqual([]);
  });

  it("omits leading zero units and pads minutes and seconds", () => {
    for (const [seconds, expected] of [
      [0, "0s"],
      [59, "59s"],
      [60, "01m 00s"],
      [7200, "2h 00m 00s"],
      [90_061 + 86_400 * 2, "3d 1h 01m 01s"],
    ] as const) {
      expect(calculateFormatDuration({ seconds })).toMatchObject({
        output: { formatted: expected },
      });
    }
  });

  it("formats ISO-8601 durations", () => {
    for (const [seconds, expected] of [
      [0, "PT0S"],
      [3661, "PT1H1M1S"],
      [90061, "P1DT1H1M1S"],
    ] as const)
      expect(
        calculateFormatDuration({ seconds, style: "iso" }),
      ).toMatchObject({ output: { formatted: expected } });
  });

  it("truncates fractional seconds", () => {
    expect(calculateFormatDuration({ seconds: 90.9 })).toMatchObject({
      output: { formatted: "01m 30s" },
    });
  });

  it("rejects malformed probes", () => {
    expect(calculateFormatDuration(null).ok).toBe(false);
    expect(calculateFormatDuration({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateFormatDuration({ seconds: -1 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateFormatDuration({ seconds: Number.NaN }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(calculateFormatDuration({ seconds: 5, style: "fancy" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateFormatDuration({ extra: 1, seconds: 5 })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
