import { describe, expect, it } from "vitest";
import {
  calculateScanningPpiTypeLookup,
  runScanningPpiTypeLookup,
  scanningPpiTypeLookupExample,
} from "./tool.js";

describe("archival-studies/scanning-ppi-type-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runScanningPpiTypeLookup(scanningPpiTypeLookupExample.input),
    ).toEqual({ ok: true, output: scanningPpiTypeLookupExample.output });
  });

  it("maps reflective and transmissive originals to distinct resolutions", () => {
    expect(
      calculateScanningPpiTypeLookup({ originalType: "photographic-print" }),
    ).toEqual({ recommendedPpi: 600 });
    expect(
      calculateScanningPpiTypeLookup({ originalType: "slide-35mm" }),
    ).toEqual({ recommendedPpi: 3200 });
  });

  it("rejects unknown original types at the tool boundary", () => {
    expect(
      runScanningPpiTypeLookup({
        originalType: "microfiche",
      } as never).ok,
    ).toBe(false);
  });
});
