import { describe, expect, it } from "vitest";
import { runStrongBasePh, strongBasePhExample } from "./tool.js";
describe("Strong Base pH", () => {
  it("publishes an executable example", () =>
    expect(runStrongBasePh(strongBasePhExample.input)).toEqual({
      ok: true,
      output: strongBasePhExample.output,
    }));
  it("maps one tenths molar to pH thirteen", () =>
    expect(runStrongBasePh({ baseConcM: 0.1 })).toEqual({
      ok: true,
      output: { ph: 13 },
    }));
  it("maps one times ten to the minus seventh molar to neutral pH", () =>
    expect(runStrongBasePh({ baseConcM: 1e-7 })).toEqual({
      ok: true,
      output: { ph: 7 },
    }));
  it("maps one millimolar to pH eleven", () =>
    expect(runStrongBasePh({ baseConcM: 0.001 })).toEqual({
      ok: true,
      output: { ph: 11 },
    }));
  it("rejects zero concentration", () =>
    expect(runStrongBasePh({ baseConcM: 0 }).ok).toBe(false));
  it("rejects negative concentration", () =>
    expect(runStrongBasePh({ baseConcM: -0.1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runStrongBasePh({ baseConcM: "base" }).ok).toBe(false));
});
