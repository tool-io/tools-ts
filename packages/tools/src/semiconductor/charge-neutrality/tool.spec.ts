import { describe, expect, it } from "vitest";
import { chargeNeutralityExample, runChargeNeutrality } from "./tool.js";
import type { ChargeNeutralityOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runChargeNeutrality>,
): ChargeNeutralityOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as ChargeNeutralityOutput;
};

describe("Charge Neutrality Carrier Solver", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runChargeNeutrality(chargeNeutralityExample.input)).toEqual({
      ok: true,
      output: chargeNeutralityExample.output,
    });
  });

  it("returns intrinsic carriers for a balanced compensation ratio", () => {
    expect(
      runChargeNeutrality({
        donorConc: 5e15,
        acceptorConc: 5e15,
        intrinsicConc: 1e10,
      }),
    ).toEqual({
      ok: true,
      output: {
        electronConcPerCm3: 10000000000,
        holeConcPerCm3: 10000000000,
      },
    });
  });

  it("returns intrinsic carriers for undoped material", () => {
    expect(
      runChargeNeutrality({
        donorConc: 0,
        acceptorConc: 0,
        intrinsicConc: 1e10,
      }),
    ).toEqual({
      ok: true,
      output: {
        electronConcPerCm3: 10000000000,
        holeConcPerCm3: 10000000000,
      },
    });
  });

  it("solves the p-type dominant regime exactly", () => {
    expect(
      runChargeNeutrality({
        donorConc: 0,
        acceptorConc: 1e16,
        intrinsicConc: 1e10,
      }),
    ).toEqual({
      ok: true,
      output: {
        electronConcPerCm3: 9999.999999990001,
        holeConcPerCm3: 10000000000010000,
      },
    });
  });

  it("keeps np equal to ni squared in the n-type dominant regime", () => {
    const output = outputOf(
      runChargeNeutrality({
        donorConc: 1e17,
        acceptorConc: 0,
        intrinsicConc: 1e10,
      }),
    );
    expect(
      (output.electronConcPerCm3 * output.holeConcPerCm3) / 1e20,
    ).toBeCloseTo(1, 6);
    expect(output.electronConcPerCm3).toBeGreaterThan(1e17);
    expect(output.electronConcPerCm3).toBeLessThan(1e17 + 2000);
  });

  it("flips carrier dominance when acceptors exceed donors", () => {
    const output = outputOf(
      runChargeNeutrality({
        donorConc: 1e14,
        acceptorConc: 1e16,
        intrinsicConc: 1e10,
      }),
    );
    expect(output.holeConcPerCm3).toBeGreaterThan(1e15);
    expect(output.electronConcPerCm3).toBeLessThan(output.holeConcPerCm3);
  });

  it("rejects negative donor concentrations", () => {
    const result = runChargeNeutrality({
      donorConc: -1e16,
      acceptorConc: 0,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "donorConc",
      });
  });

  it("rejects negative acceptor concentrations", () => {
    const result = runChargeNeutrality({
      donorConc: 0,
      acceptorConc: -1e16,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "acceptorConc",
      });
  });

  it("rejects zero intrinsic concentration", () => {
    const result = runChargeNeutrality({
      donorConc: 1e17,
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

  it("requires all three concentrations", () => {
    const result = runChargeNeutrality({
      donorConc: 1e17,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "acceptorConc",
      });
  });

  it("rejects non-finite inputs", () => {
    const result = runChargeNeutrality({
      donorConc: Number.NaN,
      acceptorConc: 1e15,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects input that is not an object", () => {
    const result = runChargeNeutrality("n=1e10");
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("object_required");
  });
});
