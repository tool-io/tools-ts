import { describe, expect, it } from "vitest";
import {
  calculateSawFilterCenterFrequency,
  runSawFilterCenterFrequency,
  sawFilterCenterFrequencyExample,
} from "./tool.js";

describe("SAW Center Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSawFilterCenterFrequency(sawFilterCenterFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: sawFilterCenterFrequencyExample.output,
    });
  });

  it("matches a 315 MHz ISM-band filter for a ten-micron pitch", () => {
    expect(runSawFilterCenterFrequency({ pitchUm: 10 })).toEqual({
      ok: true,
      output: { centerFrequencyMhz: 157.5 },
    });
  });

  it("doubles frequency when pitch halves", () => {
    const coarse = calculateSawFilterCenterFrequency({
      pitchUm: 2,
    }).centerFrequencyMhz;
    const fine = calculateSawFilterCenterFrequency({
      pitchUm: 1,
    }).centerFrequencyMhz;
    expect(fine).toBe(coarse * 2);
  });

  it("honors a custom substrate velocity", () => {
    expect(
      runSawFilterCenterFrequency({ pitchUm: 1, velocityMsPerS: 3990 }),
    ).toEqual({
      ok: true,
      output: { centerFrequencyMhz: 1995 },
    });
  });

  it("rejects zero pitch via invalid_pitch", () => {
    expect(runSawFilterCenterFrequency({ pitchUm: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_pitch", field: "pitchUm" }] },
      ok: false,
    });
  });

  it("rejects negative pitch via invalid_pitch", () => {
    expect(runSawFilterCenterFrequency({ pitchUm: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_pitch", field: "pitchUm" }] },
      ok: false,
    });
  });

  it("rejects non-positive velocity via invalid_velocity", () => {
    expect(
      runSawFilterCenterFrequency({ pitchUm: 1, velocityMsPerS: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_velocity", field: "velocityMsPerS" }],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runSawFilterCenterFrequency({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "pitchUm" }] },
      ok: false,
    });
  });
});
