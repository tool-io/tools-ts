import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateVoidFraction,
  voidFractionExample,
  voidFractionTool,
} from "./tool.js";

describe("void fraction", () => {
  it("reproduces the canonical example", () => {
    expect(calculateVoidFraction(voidFractionExample.input)).toEqual({
      ok: true,
      output: voidFractionExample.output,
    });
  });

  it("publishes a portable example and valid pure contract", () => {
    expect(JSON.parse(JSON.stringify(voidFractionExample))).toEqual(
      voidFractionExample,
    );
    expect(validateToolContract(voidFractionTool)).toEqual([]);
  });

  it("complements the full packing-fraction range", () => {
    expect(calculateVoidFraction({ packingFraction: 0 })).toEqual({
      ok: true,
      output: { voidFraction: 1 },
    });
    expect(calculateVoidFraction({ packingFraction: 1 })).toEqual({
      ok: true,
      output: { voidFraction: 0 },
    });
  });

  it("rejects malformed and out-of-range inputs", () => {
    expect(calculateVoidFraction(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(calculateVoidFraction({ packingFraction: 1.1 })).toMatchObject({
      error: {
        issues: [{ code: "fraction_out_of_range", field: "packingFraction" }],
      },
      ok: false,
    });
    expect(
      calculateVoidFraction({ packingFraction: Number.NaN }),
    ).toMatchObject({
      error: {
        issues: [{ code: "fraction_out_of_range", field: "packingFraction" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      calculateVoidFraction({ packingFraction: 0.25, extra: true }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
