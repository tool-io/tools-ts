import { describe, expect, it } from "vitest";
import {
  portsmouthYardstickCorrectedExample,
  runPortsmouthYardstickCorrected,
} from "./tool.js";

describe("portsmouth yardstick corrected time calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPortsmouthYardstickCorrected(
        portsmouthYardstickCorrectedExample.input,
      ),
    ).toEqual({
      ok: true,
      output: portsmouthYardstickCorrectedExample.output,
    });
  });

  it("divides elapsed time by the yardstick fraction", () => {
    const result = runPortsmouthYardstickCorrected({
      elapsedSeconds: 5400,
      pyNumber: 105,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedTimeSeconds).toBe(5142.857142857143);
  });

  it("scales linearly with elapsed seconds", () => {
    const base = runPortsmouthYardstickCorrected({
      elapsedSeconds: 1800,
      pyNumber: 110,
    });
    const doubled = runPortsmouthYardstickCorrected({
      elapsedSeconds: 3600,
      pyNumber: 110,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.correctedTimeSeconds).toBe(
      2 * (base.output.correctedTimeSeconds as number),
    );
  });

  it("gives slower classes larger corrected times for the same elapsed time", () => {
    const fast = runPortsmouthYardstickCorrected({
      elapsedSeconds: 3600,
      pyNumber: 140,
    });
    const slow = runPortsmouthYardstickCorrected({
      elapsedSeconds: 3600,
      pyNumber: 70,
    });
    if (!fast.ok || !slow.ok) throw new Error("expected success");
    expect(slow.output.correctedTimeSeconds).toBeGreaterThan(
      fast.output.correctedTimeSeconds as number,
    );
  });

  it("rejects zero and negative elapsed seconds with a stable code", () => {
    for (const elapsedSeconds of [0, -1])
      expect(
        runPortsmouthYardstickCorrected({ elapsedSeconds, pyNumber: 100 }),
      ).toEqual({
        error: {
          code: "invalid_input",
          issues: [
            {
              code: "invalid_input",
              field: "elapsedSeconds",
              message: "Elapsed time must be positive.",
            },
          ],
        },
        ok: false,
      });
  });

  it("rejects zero and negative Portsmouth Numbers with a stable code", () => {
    for (const pyNumber of [0, -50])
      expect(
        runPortsmouthYardstickCorrected({ elapsedSeconds: 600, pyNumber }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "pyNumber" }] },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runPortsmouthYardstickCorrected({ pyNumber: 100 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "elapsedSeconds" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { elapsedSeconds: Number.NaN, pyNumber: 100 },
      { elapsedSeconds: Number.POSITIVE_INFINITY, pyNumber: 100 },
      { elapsedSeconds: 3600, pyNumber: Number.NaN },
    ])
      expect(runPortsmouthYardstickCorrected(bad).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runPortsmouthYardstickCorrected({
        elapsedSeconds: 3600,
        extra: true,
        pyNumber: 120,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
