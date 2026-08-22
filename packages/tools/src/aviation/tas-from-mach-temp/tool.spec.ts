import { describe, expect, it } from "vitest";
import { tasFromMachTempExample, runTasFromMachTemp } from "./tool.js";

describe("tas from mach temperature calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTasFromMachTemp(tasFromMachTempExample.input)).toEqual({
      ok: true,
      output: tasFromMachTempExample.output,
    });
  });

  it("matches the speed of sound at ISA sea level", () => {
    const result = runTasFromMachTemp({ machNumber: 1, oatC: 15 });
    if (!result.ok) throw new Error("expected success");
    expect(Number(result.output.tasKt)).toBeCloseTo(661.4791659074438, 9);
  });

  it("scales linearly with Mach number at fixed temperature", () => {
    const half = runTasFromMachTemp({ machNumber: 0.4, oatC: -50 });
    const full = runTasFromMachTemp({ machNumber: 0.8, oatC: -50 });
    if (!half.ok || !full.ok) throw new Error("expected success");
    expect(Number(full.output.tasKt) / Number(half.output.tasKt)).toBeCloseTo(
      2,
      12,
    );
  });

  it("drops as temperature drops at constant Mach", () => {
    const warm = runTasFromMachTemp({ machNumber: 0.8, oatC: -30 });
    const cold = runTasFromMachTemp({ machNumber: 0.8, oatC: -60 });
    if (!warm.ok || !cold.ok) throw new Error("expected success");
    expect(Number(cold.output.tasKt)).toBeLessThan(Number(warm.output.tasKt));
  });

  it("accepts the extreme temperature and Mach boundaries", () => {
    expect(runTasFromMachTemp({ machNumber: 5, oatC: -90 })).toMatchObject({
      ok: true,
    });
    expect(runTasFromMachTemp({ machNumber: 5, oatC: 60 })).toMatchObject({
      ok: true,
    });
  });

  it("rejects zero Mach numbers", () => {
    const result = runTasFromMachTemp({ machNumber: 0, oatC: -50 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_mach_number");
  });

  it("rejects Mach numbers beyond the supersonic-to-hypersonic cap", () => {
    expect(runTasFromMachTemp({ machNumber: 5.1, oatC: -50 })).toMatchObject({
      ok: false,
    });
  });

  it("rejects temperatures outside the atmosphere range", () => {
    expect(runTasFromMachTemp({ machNumber: 0.8, oatC: -90.1 })).toMatchObject({
      ok: false,
    });
    expect(runTasFromMachTemp({ machNumber: 0.8, oatC: 60.1 })).toMatchObject({
      ok: false,
    });
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runTasFromMachTemp({ machNumber: 0.8 })).toMatchObject({
      ok: false,
    });
    expect(runTasFromMachTemp({ machNumber: "fast", oatC: -50 })).toMatchObject(
      { ok: false },
    );
  });
});
