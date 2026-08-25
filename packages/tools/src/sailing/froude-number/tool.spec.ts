import { describe, expect, it } from "vitest";
import { froudeNumberExample, runFroudeNumber } from "./tool.js";

describe("froude number calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFroudeNumber(froudeNumberExample.input)).toEqual({
      ok: true,
      output: froudeNumberExample.output,
    });
  });

  it("gives geometrically similar boats the same Froude number", () => {
    const small = runFroudeNumber({ lengthMeters: 9, speedMs: 3 });
    if (!small.ok) throw new Error("expected success");
    expect(small.output.froudeNumber).toBe(0.3193299567810587);
  });

  it("rises with speed for a fixed length", () => {
    const slow = runFroudeNumber({ lengthMeters: 25, speedMs: 2 });
    const fast = runFroudeNumber({ lengthMeters: 25, speedMs: 6 });
    if (!slow.ok || !fast.ok) throw new Error("expected success");
    expect(fast.output.froudeNumber).toBeGreaterThan(
      slow.output.froudeNumber as number,
    );
  });

  it("falls as length grows for a fixed speed", () => {
    const short = runFroudeNumber({ lengthMeters: 10, speedMs: 5 });
    const long = runFroudeNumber({ lengthMeters: 40, speedMs: 5 });
    if (!short.ok || !long.ok) throw new Error("expected success");
    expect(long.output.froudeNumber).toBeLessThan(
      short.output.froudeNumber as number,
    );
  });

  it("returns zero at rest and rejects negative speeds", () => {
    expect(runFroudeNumber({ lengthMeters: 10, speedMs: 0 })).toEqual({
      ok: true,
      output: { froudeNumber: 0 },
    });
    for (const speedMs of [-1.5])
      expect(runFroudeNumber({ lengthMeters: 10, speedMs })).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "speedMs" }] },
        ok: false,
      });
  });

  it("rejects zero and negative lengths with a stable code", () => {
    for (const lengthMeters of [0, -10])
      expect(runFroudeNumber({ lengthMeters, speedMs: 5 })).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "lengthMeters" }] },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runFroudeNumber({ speedMs: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthMeters" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { lengthMeters: Number.NaN, speedMs: 5 },
      { lengthMeters: 25, speedMs: Number.NEGATIVE_INFINITY },
    ])
      expect(runFroudeNumber(bad).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runFroudeNumber({
        beamMeters: 4,
        lengthMeters: 25,
        speedMs: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beamMeters" }] },
      ok: false,
    });
  });
});
