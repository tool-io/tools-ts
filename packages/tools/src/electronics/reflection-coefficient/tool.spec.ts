import { describe, expect, it } from "vitest";
import {
  reflectionCoefficientExample,
  runReflectionCoefficient,
} from "./tool.js";

describe("Reflection Coefficient", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runReflectionCoefficient(reflectionCoefficientExample.input),
    ).toEqual({ ok: true, output: reflectionCoefficientExample.output }));

  it("returns zero for a matched load", () =>
    expect(runReflectionCoefficient({ loadOhms: 50, sourceOhms: 50 })).toEqual({
      ok: true,
      output: { reflectionCoefficient: 0 },
    }));

  it("returns one half for a tripled load impedance", () =>
    expect(runReflectionCoefficient({ loadOhms: 150, sourceOhms: 50 })).toEqual(
      { ok: true, output: { reflectionCoefficient: 0.5 } },
    ));

  it("turns negative when the load is smaller than the source", () =>
    expect(runReflectionCoefficient({ loadOhms: 25, sourceOhms: 75 })).toEqual({
      ok: true,
      output: { reflectionCoefficient: -0.5 },
    }));

  it("rejects zero load impedance", () =>
    expect(
      runReflectionCoefficient({ loadOhms: 0, sourceOhms: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "loadOhms" }] },
      ok: false,
    }));

  it("rejects zero source impedance", () =>
    expect(
      runReflectionCoefficient({ loadOhms: 75, sourceOhms: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "sourceOhms" }] },
      ok: false,
    }));

  it("rejects negative source impedance", () =>
    expect(
      runReflectionCoefficient({ loadOhms: 75, sourceOhms: -50 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "sourceOhms" }] },
      ok: false,
    }));
});
