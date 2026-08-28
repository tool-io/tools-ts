import { describe, expect, it } from "vitest";
import {
  runHeatOfVaporizationTrouton,
  heatOfVaporizationTroutonExample,
} from "./tool.js";
describe("Trouton Rule Estimate", () => {
  it("publishes an executable example", () =>
    expect(
      runHeatOfVaporizationTrouton(heatOfVaporizationTroutonExample.input),
    ).toEqual({ ok: true, output: heatOfVaporizationTroutonExample.output }));
  it("scales linearly with boiling point", () =>
    expect(runHeatOfVaporizationTrouton({ boilingPointK: 100 })).toEqual({
      ok: true,
      output: { enthalpyOfVaporizationKJPerMol: 8.5 },
    }));
  it("accepts the lower bound of fifty kelvin", () =>
    expect(runHeatOfVaporizationTrouton({ boilingPointK: 50 })).toEqual({
      ok: true,
      output: { enthalpyOfVaporizationKJPerMol: 4.25 },
    }));
  it("accepts the upper bound of six hundred kelvin", () =>
    expect(runHeatOfVaporizationTrouton({ boilingPointK: 600 })).toEqual({
      ok: true,
      output: { enthalpyOfVaporizationKJPerMol: 51.00000000000001 },
    }));
  it("rejects a boiling point below fifty kelvin", () =>
    expect(runHeatOfVaporizationTrouton({ boilingPointK: 49.9 }).ok).toBe(
      false,
    ));
  it("rejects a boiling point above six hundred kelvin", () =>
    expect(runHeatOfVaporizationTrouton({ boilingPointK: 600.1 }).ok).toBe(
      false,
    ));
});
