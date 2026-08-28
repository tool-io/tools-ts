import { describe, expect, it } from "vitest";
import { runVswrFromReflection, vswrFromReflectionExample } from "./tool.js";

describe("VSWR From Gamma", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runVswrFromReflection(vswrFromReflectionExample.input)).toEqual({
      ok: true,
      output: vswrFromReflectionExample.output,
    }));

  it("returns a VSWR of one for a matched system", () =>
    expect(runVswrFromReflection({ reflectionCoefficient: 0 })).toEqual({
      ok: true,
      output: { vswr: 1 },
    }));

  it("maps a gamma of one half to a VSWR of three", () =>
    expect(runVswrFromReflection({ reflectionCoefficient: 0.5 })).toEqual({
      ok: true,
      output: { vswr: 3 },
    }));

  it("uses the magnitude for negative gamma values", () =>
    expect(runVswrFromReflection({ reflectionCoefficient: -0.5 })).toEqual({
      ok: true,
      output: { vswr: 3 },
    }));

  it("rejects a gamma magnitude of exactly one", () =>
    expect(runVswrFromReflection({ reflectionCoefficient: 1 })).toMatchObject({
      error: {
        issues: [
          { code: "invalid_reflection", field: "reflectionCoefficient" },
        ],
      },
      ok: false,
    }));

  it("rejects gamma magnitudes above one", () =>
    expect(runVswrFromReflection({ reflectionCoefficient: -2 })).toMatchObject({
      error: {
        issues: [
          { code: "invalid_reflection", field: "reflectionCoefficient" },
        ],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runVswrFromReflection(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
