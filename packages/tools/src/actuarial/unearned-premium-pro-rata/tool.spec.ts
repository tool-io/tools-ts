import { describe, expect, it } from "vitest";
import {
  unearnedPremiumProRataExample,
  unearnedPremiumProRataTool,
  runUnearnedPremiumProRata,
} from "./tool.js";

describe("unearnedPremiumProRataTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runUnearnedPremiumProRata(unearnedPremiumProRataExample.input),
    ).toEqual({
      ok: true,
      output: unearnedPremiumProRataExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(unearnedPremiumProRataExample))).toEqual(
      unearnedPremiumProRataExample,
    );
    expect(unearnedPremiumProRataTool.contractVersion).toBe(1);
    expect(unearnedPremiumProRataTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runUnearnedPremiumProRata(null).ok).toBe(false);
    expect(
      runUnearnedPremiumProRata({
        ...unearnedPremiumProRataExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("unearned premium pro rata boundaries", () => {
  it("earns fully at term end", () => {
    const result = runUnearnedPremiumProRata({
      daysElapsed: 365,
      policyTermDays: 365,
      writtenPremium: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.unearnedPremium).toBe(0);
  });

  it("rejects elapsed days beyond the term", () => {
    expect(
      runUnearnedPremiumProRata({
        daysElapsed: 366,
        policyTermDays: 365,
        writtenPremium: 100,
      }).ok,
    ).toBe(false);
  });
});
