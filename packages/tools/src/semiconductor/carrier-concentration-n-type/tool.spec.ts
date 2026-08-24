import { describe, expect, it } from "vitest";
import {
  carrierConcentrationNTypeExample,
  runCarrierConcentrationNType,
} from "./tool.js";
import type { CarrierConcentrationNTypeOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runCarrierConcentrationNType>,
): CarrierConcentrationNTypeOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as CarrierConcentrationNTypeOutput;
};

describe("N-Type Carrier Concentration Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCarrierConcentrationNType(carrierConcentrationNTypeExample.input),
    ).toEqual({ ok: true, output: carrierConcentrationNTypeExample.output });
  });

  it("returns the intrinsic concentration for undoped silicon", () => {
    expect(
      runCarrierConcentrationNType({ donorConc: 0, intrinsicConc: 1.5e10 }),
    ).toEqual({
      ok: true,
      output: { electronConcPerCm3: 15000000000 },
    });
  });

  it("approaches the donor level under degenerate doping", () => {
    expect(
      runCarrierConcentrationNType({ donorConc: 1e18, intrinsicConc: 1e7 }),
    ).toEqual({
      ok: true,
      output: { electronConcPerCm3: 1000000000000000000 },
    });
  });

  it("exceeds the donor level by at most the intrinsic correction", () => {
    const n = outputOf(
      runCarrierConcentrationNType({ donorConc: 1e16, intrinsicConc: 1e10 }),
    ).electronConcPerCm3;
    expect(n).toBeGreaterThan(1e16);
    expect(n).toBeLessThan(1e16 + 2e4);
  });

  it("balances majority excess against the minority concentration", () => {
    const n = outputOf(
      runCarrierConcentrationNType({ donorConc: 1e16, intrinsicConc: 1e10 }),
    ).electronConcPerCm3;
    expect(n - 1e16).toBeGreaterThan(0);
    expect((1e10 * 1e10) / n / (n - 1e16)).toBeCloseTo(1, 6);
  });

  it("increases monotonically with donor doping", () => {
    const lighter = outputOf(
      runCarrierConcentrationNType({ donorConc: 1e15, intrinsicConc: 1e10 }),
    ).electronConcPerCm3;
    const heavier = outputOf(
      runCarrierConcentrationNType({ donorConc: 1e17, intrinsicConc: 1e10 }),
    ).electronConcPerCm3;
    expect(heavier).toBeGreaterThan(lighter);
  });

  it("rejects negative donor concentrations", () => {
    const result = runCarrierConcentrationNType({
      donorConc: -1,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "donorConc",
      });
  });

  it("rejects zero intrinsic concentration via schema", () => {
    const result = runCarrierConcentrationNType({
      donorConc: 1e16,
      intrinsicConc: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "intrinsicConc",
      });
  });

  it("rejects negative intrinsic concentrations", () => {
    const result = runCarrierConcentrationNType({
      donorConc: 1e16,
      intrinsicConc: -1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the donor concentration", () => {
    const result = runCarrierConcentrationNType({ intrinsicConc: 1e10 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "donorConc",
      });
  });

  it("rejects non-finite inputs", () => {
    const result = runCarrierConcentrationNType({
      donorConc: 1e16,
      intrinsicConc: Number.POSITIVE_INFINITY,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runCarrierConcentrationNType({
      acceptorConc: 0,
      donorConc: 1e16,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "acceptorConc",
      });
  });
});
