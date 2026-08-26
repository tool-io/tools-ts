import { describe, expect, it } from "vitest";
import {
  calculateUnWppScenarioVariantLookup,
  runUnWppScenarioVariantLookup,
  unWppScenarioVariantLookupExample,
} from "./tool.js";

describe("demography/un-wpp-scenario-variant-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUnWppScenarioVariantLookup(unWppScenarioVariantLookupExample.input),
    ).toEqual({ ok: true, output: unWppScenarioVariantLookupExample.output });
  });

  it("describes every documented variant", () => {
    const variants = (["high", "low", "momentum", "noChange"] as const).map(
      (variant) => calculateUnWppScenarioVariantLookup({ variant }),
    );
    expect(variants.map((variant) => variant.fullName)).toEqual([
      "High variant",
      "Low variant",
      "Momentum variant",
      "No-change variant",
    ]);
  });

  it("rejects unknown variants", () => {
    expect(
      runUnWppScenarioVariantLookup({ variant: "super" as never }).ok,
    ).toBe(false);
  });
});
