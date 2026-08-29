import { describe, expect, it } from "vitest";
import { runStrongAcidPh, strongAcidPhExample } from "./tool.js";
describe("Strong Acid pH", () => {
  it("publishes an executable example", () =>
    expect(runStrongAcidPh(strongAcidPhExample.input)).toEqual({
      ok: true,
      output: strongAcidPhExample.output,
    }));
  it("maps one millimolar to pH three", () =>
    expect(runStrongAcidPh({ acidConcentrationM: 0.001 })).toEqual({
      ok: true,
      output: { ph: 3 },
    }));
  it("maps one tenths molar to pH one", () =>
    expect(runStrongAcidPh({ acidConcentrationM: 0.1 })).toEqual({
      ok: true,
      output: { ph: 1 },
    }));
  it("maps one times ten to the minus fourth molar to pH four", () =>
    expect(runStrongAcidPh({ acidConcentrationM: 1e-4 })).toEqual({
      ok: true,
      output: { ph: 4 },
    }));
  it("rejects zero concentration", () =>
    expect(runStrongAcidPh({ acidConcentrationM: 0 }).ok).toBe(false));
  it("rejects negative concentration", () =>
    expect(runStrongAcidPh({ acidConcentrationM: -0.01 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runStrongAcidPh({ acidConcentrationM: "strong" }).ok).toBe(false));
});
