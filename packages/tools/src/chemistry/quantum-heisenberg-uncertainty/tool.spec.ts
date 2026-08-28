import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateHeisenbergUncertainty,
  heisenbergUncertaintyExample,
  heisenbergUncertaintyTool,
} from "./tool.js";

describe("Heisenberg uncertainty", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateHeisenbergUncertainty(heisenbergUncertaintyExample.input),
    ).toEqual({
      ok: true,
      output: heisenbergUncertaintyExample.output,
    });
  });

  it("publishes a portable example and valid pure contract", () => {
    expect(JSON.parse(JSON.stringify(heisenbergUncertaintyExample))).toEqual(
      heisenbergUncertaintyExample,
    );
    expect(validateToolContract(heisenbergUncertaintyTool)).toEqual([]);
  });

  it("halves the minimum momentum uncertainty when position uncertainty doubles", () => {
    const input = heisenbergUncertaintyExample.input;
    const base = calculateHeisenbergUncertainty(input);
    const doubled = calculateHeisenbergUncertainty({
      positionUncertaintyM: input.positionUncertaintyM * 2,
    });
    if (!base.ok || !doubled.ok)
      throw new Error("expected valid uncertainty calculations");
    expect(doubled.output.minimumMomentumUncertaintyKgMs).toBeCloseTo(
      base.output.minimumMomentumUncertaintyKgMs / 2,
      12,
    );
  });

  it("rejects malformed and non-positive uncertainties", () => {
    expect(calculateHeisenbergUncertainty(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      calculateHeisenbergUncertainty({ positionUncertaintyM: 0 }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_finite_number_required",
            field: "positionUncertaintyM",
          },
        ],
      },
      ok: false,
    });
    expect(
      calculateHeisenbergUncertainty({ positionUncertaintyM: Number.NaN }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_finite_number_required",
            field: "positionUncertaintyM",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      calculateHeisenbergUncertainty({
        positionUncertaintyM: 1e-10,
        extra: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
