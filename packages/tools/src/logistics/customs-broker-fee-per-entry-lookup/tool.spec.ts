import { describe, expect, it } from "vitest";
import {
  calculateCustomsBrokerFeePerEntryLookup,
  customsBrokerFeePerEntryLookupExample,
  runCustomsBrokerFeePerEntryLookup,
} from "./tool.js";

describe("logistics/customs-broker-fee-per-entry-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCustomsBrokerFeePerEntryLookup(
        customsBrokerFeePerEntryLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: customsBrokerFeePerEntryLookupExample.output,
    });
  });

  it("raises the effective fee to the contractual minimum", () => {
    const result = runCustomsBrokerFeePerEntryLookup({
      entryCount: 10,
      minimumFeePerEntry: 200,
      totalBrokerageSpend: 1500,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.averageFeePerEntry as number).toBe(150);
    expect(result.output.effectiveFeePerEntry as number).toBe(200);
  });

  it("rejects zero entries", () => {
    expect(
      runCustomsBrokerFeePerEntryLookup({
        entryCount: 0,
        totalBrokerageSpend: 100,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional entries and invalid benchmarks", () => {
    expect(() =>
      calculateCustomsBrokerFeePerEntryLookup({
        entryCount: 1.5,
        totalBrokerageSpend: 100,
      }),
    ).toThrow("Entry count");
    expect(() =>
      calculateCustomsBrokerFeePerEntryLookup({
        benchmarkFeePerEntry: 0,
        entryCount: 1,
        totalBrokerageSpend: 100,
      }),
    ).toThrow("benchmark fee");
  });
});
