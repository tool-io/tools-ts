import { describe, expect, it } from "vitest";
import {
  runSpectrochemicalSeriesLookup,
  spectrochemicalSeriesLookupExample,
} from "./tool.js";

describe("Spectrochemical Series Lookup", () => {
  it("publishes an executable water example", () =>
    expect(
      runSpectrochemicalSeriesLookup(spectrochemicalSeriesLookupExample.input),
    ).toEqual({ ok: true, output: spectrochemicalSeriesLookupExample.output }));
  it("places cyanide above chloride in field strength", () => {
    const chloride = runSpectrochemicalSeriesLookup({ ligand: "chloride" });
    const cyanide = runSpectrochemicalSeriesLookup({ ligand: "CN−" });
    expect(chloride.ok && cyanide.ok).toBe(true);
    if (chloride.ok && cyanide.ok)
      expect(Number(cyanide.output.weakToStrongRank)).toBeGreaterThan(
        Number(chloride.output.weakToStrongRank),
      );
  });
  it("rejects an unsupported ligand", () =>
    expect(runSpectrochemicalSeriesLookup({ ligand: "unknown" }).ok).toBe(
      false,
    ));
});
