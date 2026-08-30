import { describe, expect, it } from "vitest";
import {
  lookupSlaughterFuturesStudyWave,
  runSlaughterWave,
  slaughterWaveExample,
} from "./tool.js";

describe("Slaughter futures-studies waves evolution lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runSlaughterWave(slaughterWaveExample.input)).toEqual({
      ok: true,
      output: slaughterWaveExample.output,
    });
  });

  it("looks up early practice", () => {
    expect(
      lookupSlaughterFuturesStudyWave({ wave: "earlyPractice" }).waveLabel,
    ).toBe("early practice");
  });

  it("looks up integrated practice", () => {
    expect(
      lookupSlaughterFuturesStudyWave({ wave: "integrated" }).development,
    ).toContain("monitoring");
  });

  it("rejects an unsupported wave at the public boundary", () => {
    expect(runSlaughterWave({ wave: "forecasting" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "wave" }] },
      ok: false,
    });
  });
});
