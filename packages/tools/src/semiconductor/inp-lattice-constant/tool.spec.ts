import { describe, expect, it } from "vitest";
import { inpLatticeConstantExample, runInpLatticeConstant } from "./tool.js";

describe("InP Lattice Constant Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runInpLatticeConstant(inpLatticeConstantExample.input)).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.871007198 },
    }));

  it("defaults to the 25 degrees Celsius reference value", () =>
    expect(runInpLatticeConstant({})).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.869 },
    }));

  it("returns the reference value at 25 degrees Celsius", () =>
    expect(runInpLatticeConstant({ temperatureC: 25 })).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.869 },
    }));

  it("handles the lower temperature boundary", () =>
    expect(runInpLatticeConstant({ temperatureC: -50 })).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.866992802 },
    }));

  it("handles the upper temperature boundary", () =>
    expect(runInpLatticeConstant({ temperatureC: 300 })).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.8763597260000004 },
    }));

  it("contracts toward 0 degrees Celsius", () =>
    expect(runInpLatticeConstant({ temperatureC: 0 })).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.868330934 },
    }));

  it("expands the lattice as temperature rises", () => {
    const cold = runInpLatticeConstant({ temperatureC: -50 });
    const hot = runInpLatticeConstant({ temperatureC: 300 });
    expect(cold.ok && hot.ok).toBe(true);
    if (cold.ok && hot.ok)
      expect(hot.output.latticeConstantAngstrom).toBeGreaterThan(
        cold.output.latticeConstantAngstrom,
      );
  });

  it("rejects temperatures below the valid range", () =>
    expect(runInpLatticeConstant({ temperatureC: -50.01 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "temperatureC" }] },
      ok: false,
    }));

  it("rejects temperatures above the valid range", () =>
    expect(runInpLatticeConstant({ temperatureC: 300.01 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "temperatureC" }] },
      ok: false,
    }));

  it("rejects non-finite temperatures", () =>
    expect(
      runInpLatticeConstant({ temperatureC: Number.POSITIVE_INFINITY }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "temperatureC" }] },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runInpLatticeConstant({ temperatureC: 100, extra: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
