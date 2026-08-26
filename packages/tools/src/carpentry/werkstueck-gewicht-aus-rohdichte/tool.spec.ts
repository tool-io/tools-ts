import { describe, expect, it } from "vitest";
import { runWorkpieceWeight, workpieceWeightExample } from "./tool.js";

describe("workpiece weight calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWorkpieceWeight(workpieceWeightExample.input)).toEqual({
      ok: true,
      output: workpieceWeightExample.output,
    });
  });

  it("computes a dense hardwood panel", () => {
    expect(
      runWorkpieceWeight({
        densityKgPerCbm: 700,
        heightMm: 25,
        lengthMm: 1200,
        widthMm: 500,
      }),
    ).toEqual({
      ok: true,
      output: { weightKg: 10.5 },
    });
  });

  it("accepts the one hundred density floor", () => {
    expect(
      runWorkpieceWeight({
        densityKgPerCbm: 100,
        heightMm: 1000,
        lengthMm: 1000,
        widthMm: 100,
      }),
    ).toEqual({
      ok: true,
      output: { weightKg: 10 },
    });
  });

  it("accepts the fourteen hundred density ceiling", () => {
    expect(
      runWorkpieceWeight({
        densityKgPerCbm: 1400,
        heightMm: 50,
        lengthMm: 500,
        widthMm: 400,
      }),
    ).toEqual({
      ok: true,
      output: { weightKg: 14 },
    });
  });

  it("rejects densities below one hundred", () => {
    const result = runWorkpieceWeight({
      densityKgPerCbm: 99.5,
      heightMm: 19,
      lengthMm: 2000,
      widthMm: 600,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects densities above fourteen hundred", () => {
    expect(
      runWorkpieceWeight({
        densityKgPerCbm: 1400.5,
        heightMm: 19,
        lengthMm: 2000,
        widthMm: 600,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero length with the stable code", () => {
    const result = runWorkpieceWeight({
      densityKgPerCbm: 650,
      heightMm: 19,
      lengthMm: 0,
      widthMm: 600,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_length");
  });

  it("rejects zero width with the stable code", () => {
    const result = runWorkpieceWeight({
      densityKgPerCbm: 650,
      heightMm: 19,
      lengthMm: 2000,
      widthMm: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_width");
  });

  it("rejects zero thickness with the stable code", () => {
    const result = runWorkpieceWeight({
      densityKgPerCbm: 650,
      heightMm: 0,
      lengthMm: 2000,
      widthMm: 600,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_height");
  });

  it("requires the density and all dimensions", () => {
    expect(
      runWorkpieceWeight({ heightMm: 19, lengthMm: 2000, widthMm: 600 }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric dimensions", () => {
    const result = runWorkpieceWeight({
      densityKgPerCbm: 650,
      heightMm: 19,
      lengthMm: "2000",
      widthMm: 600,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });
});
