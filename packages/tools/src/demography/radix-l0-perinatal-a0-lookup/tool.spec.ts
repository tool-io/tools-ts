import { describe, expect, it } from "vitest";
import {
  calculateRadixL0PerinatalA0Lookup,
  runRadixL0PerinatalA0Lookup,
  radixL0PerinatalA0LookupExample,
} from "./tool.js";

describe("demography/radix-l0-perinatal-a0-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRadixL0PerinatalA0Lookup(radixL0PerinatalA0LookupExample.input),
    ).toEqual({
      ok: true,
      output: radixL0PerinatalA0LookupExample.output,
    });
  });

  it("switches to the unit radix and the Coale-Demeny rule on request", () => {
    expect(
      calculateRadixL0PerinatalA0Lookup({
        radix: "unit",
        a0Rule: "coaleDemenyInfant",
        m0: 0.02,
      }),
    ).toEqual({ radixL0: 1, a0Years: 0.10400000000000001 });
  });

  it("rejects a non-positive width or infant rate under the Coale-Demeny rule", () => {
    expect(runRadixL0PerinatalA0Lookup({ n: 0 }).ok).toBe(false);
    expect(
      runRadixL0PerinatalA0Lookup({ a0Rule: "coaleDemenyInfant", m0: -0.01 })
        .ok,
    ).toBe(false);
  });
});
