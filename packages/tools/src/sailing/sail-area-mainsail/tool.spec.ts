import { describe, expect, it } from "vitest";
import { runSailAreaMainsail, sailAreaMainsailExample } from "./tool.js";

describe("mainsail area calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSailAreaMainsail(sailAreaMainsailExample.input)).toEqual({
      ok: true,
      output: sailAreaMainsailExample.output,
    });
  });

  it("computes half the P times E product", () => {
    const result = runSailAreaMainsail({
      footLengthMeters: 4,
      luffLengthMeters: 12.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.mainsailAreaM2).toBe(25);
  });

  it("scales linearly with luff length", () => {
    const base = runSailAreaMainsail({
      footLengthMeters: 3,
      luffLengthMeters: 8,
    });
    const doubled = runSailAreaMainsail({
      footLengthMeters: 3,
      luffLengthMeters: 16,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.mainsailAreaM2).toBe(
      2 * (base.output.mainsailAreaM2 as number),
    );
  });

  it("scales linearly with foot length", () => {
    const base = runSailAreaMainsail({
      footLengthMeters: 3,
      luffLengthMeters: 8,
    });
    const doubled = runSailAreaMainsail({
      footLengthMeters: 6,
      luffLengthMeters: 8,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.mainsailAreaM2).toBe(
      2 * (base.output.mainsailAreaM2 as number),
    );
  });

  it("rejects zero and negative luff lengths with a stable code", () => {
    for (const luffLengthMeters of [0, -10])
      expect(
        runSailAreaMainsail({ footLengthMeters: 3.5, luffLengthMeters }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_input", field: "luffLengthMeters" }],
        },
        ok: false,
      });
  });

  it("rejects zero and negative foot lengths with a stable code", () => {
    for (const footLengthMeters of [0, -3])
      expect(
        runSailAreaMainsail({ footLengthMeters, luffLengthMeters: 10 }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_input", field: "footLengthMeters" }],
        },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runSailAreaMainsail({ luffLengthMeters: 10 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "footLengthMeters" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { footLengthMeters: Number.NaN, luffLengthMeters: 10 },
      { footLengthMeters: 3.5, luffLengthMeters: Number.POSITIVE_INFINITY },
    ])
      expect(runSailAreaMainsail(bad).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runSailAreaMainsail({
        footLengthMeters: 3.5,
        headLengthMeters: 0.4,
        luffLengthMeters: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "headLengthMeters" }] },
      ok: false,
    });
  });
});
