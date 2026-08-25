import { describe, expect, it } from "vitest";
import {
  palletsPerContainerSizeLookupExample,
  runPalletsPerContainerSizeLookup,
} from "./tool.js";

describe("pallets-per-container-size-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPalletsPerContainerSizeLookup(
        palletsPerContainerSizeLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: palletsPerContainerSizeLookupExample.output,
    });
  });

  it("fits G1 pallets across two tiers when double stacked", () => {
    const result = runPalletsPerContainerSizeLookup({
      containerInternalLengthCm: 1203,
      containerInternalWidthCm: 235,
      palletLengthCm: 121.9,
      palletWidthCm: 101.6,
      stackingLayers: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.palletsPerTier).toBe(18);
    expect(result.output.maximumPallets).toBe(36);
  });
  it("rejects pallets larger than the container floor", () => {
    expect(
      runPalletsPerContainerSizeLookup({
        containerInternalLengthCm: 100,
        containerInternalWidthCm: 80,
        palletLengthCm: 200,
        palletWidthCm: 150,
      }).ok,
    ).toBe(false);
  });
});
