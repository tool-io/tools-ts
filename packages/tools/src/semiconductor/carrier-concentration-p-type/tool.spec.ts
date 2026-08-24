import { describe, expect, it } from "vitest";
import {
  carrierConcentrationPTypeExample,
  runCarrierConcentrationPType,
} from "./tool.js";
import type { CarrierConcentrationPTypeOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runCarrierConcentrationPType>,
): CarrierConcentrationPTypeOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as CarrierConcentrationPTypeOutput;
};

describe("P-Type Carrier Concentration Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCarrierConcentrationPType(carrierConcentrationPTypeExample.input),
    ).toEqual({ ok: true, output: carrierConcentrationPTypeExample.output });
  });

  it("returns the intrinsic concentration for undoped silicon", () => {
    expect(
      runCarrierConcentrationPType({ acceptorConc: 0, intrinsicConc: 1.5e10 }),
    ).toEqual({
      ok: true,
      output: { holeConcPerCm3: 15000000000 },
    });
  });

  it("approaches the acceptor level under degenerate doping", () => {
    expect(
      runCarrierConcentrationPType({ acceptorConc: 1e17, intrinsicConc: 1e8 }),
    ).toEqual({ ok: true, output: { holeConcPerCm3: 100000000000000000 } });
  });

  it("exceeds the acceptor level by at most the intrinsic correction", () => {
    const p = outputOf(
      runCarrierConcentrationPType({ acceptorConc: 1e15, intrinsicConc: 1e10 }),
    ).holeConcPerCm3;
    expect(p).toBeGreaterThan(1e15);
    expect(p).toBeLessThan(1e15 + 2e5);
  });

  it("balances majority excess against the minority concentration", () => {
    const p = outputOf(
      runCarrierConcentrationPType({ acceptorConc: 1e16, intrinsicConc: 1e10 }),
    ).holeConcPerCm3;
    expect(p - 1e16).toBeGreaterThan(0);
    expect((1e10 * 1e10) / p / (p - 1e16)).toBeCloseTo(1, 6);
  });

  it("increases monotonically with acceptor doping", () => {
    const lighter = outputOf(
      runCarrierConcentrationPType({ acceptorConc: 1e14, intrinsicConc: 1e10 }),
    ).holeConcPerCm3;
    const heavier = outputOf(
      runCarrierConcentrationPType({ acceptorConc: 1e16, intrinsicConc: 1e10 }),
    ).holeConcPerCm3;
    expect(heavier).toBeGreaterThan(lighter);
  });

  it("rejects negative acceptor concentrations", () => {
    const result = runCarrierConcentrationPType({
      acceptorConc: -5e15,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "acceptorConc",
      });
  });

  it("rejects zero intrinsic concentration via schema", () => {
    const result = runCarrierConcentrationPType({
      acceptorConc: 1e15,
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
    const result = runCarrierConcentrationPType({
      acceptorConc: 1e15,
      intrinsicConc: -1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the acceptor concentration", () => {
    const result = runCarrierConcentrationPType({ intrinsicConc: 1e10 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "acceptorConc",
      });
  });

  it("rejects non-numeric inputs", () => {
    const result = runCarrierConcentrationPType({
      acceptorConc: "high",
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runCarrierConcentrationPType({
      acceptorConc: 1e15,
      donorConc: 0,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "donorConc",
      });
  });
});
