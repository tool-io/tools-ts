import { describe, expect, it } from "vitest";
import {
  runWoodPricePerCbm,
  woodPricePerCbmExample,
  woodPricePerCbmTool,
} from "./tool.js";

describe("Wood Price per CBM Calculator", () => {
  it("computes the canonical example", () =>
    expect(runWoodPricePerCbm(woodPricePerCbmExample.input)).toEqual({
      ok: true,
      output: { pricePerCbmEur: 300 },
    }));

  it.each([
    [850, 1.7, 500],
    [450, 0.9, 500],
    [1000, 4, 250],
  ])(
    "prices %p EUR for %p cbm at %p EUR/cbm",
    (totalPriceEur, volumeCbm, expected) =>
      expect(runWoodPricePerCbm({ totalPriceEur, volumeCbm })).toEqual({
        ok: true,
        output: { pricePerCbmEur: expected },
      }),
  );

  it("returns the total price for one cubic meter", () =>
    expect(runWoodPricePerCbm({ totalPriceEur: 365, volumeCbm: 1 })).toEqual({
      ok: true,
      output: { pricePerCbmEur: 365 },
    }));

  it("supports fractional volumes", () =>
    expect(
      runWoodPricePerCbm({ totalPriceEur: 100, volumeCbm: 0.125 }),
    ).toEqual({
      ok: true,
      output: { pricePerCbmEur: 800 },
    }));

  it("rejects a zero total price with a stable error", () =>
    expect(runWoodPricePerCbm({ totalPriceEur: 0, volumeCbm: 2 })).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "must_be_positive",
            field: "totalPriceEur",
            message: "Total price must be positive.",
          },
        ],
      },
    }));

  it("rejects non-positive volumes", () => {
    const zero = runWoodPricePerCbm({ totalPriceEur: 600, volumeCbm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "volumeCbm",
        message: "Volume must be positive.",
      });
    expect(runWoodPricePerCbm({ totalPriceEur: 600, volumeCbm: -2 }).ok).toBe(
      false,
    );
  });

  it("rejects negative prices", () =>
    expect(runWoodPricePerCbm({ totalPriceEur: -600, volumeCbm: 2 }).ok).toBe(
      false,
    ));

  it("rejects missing and non-finite inputs", () => {
    expect(runWoodPricePerCbm({ volumeCbm: 2 }).ok).toBe(false);
    expect(
      runWoodPricePerCbm({
        totalPriceEur: Number.POSITIVE_INFINITY,
        volumeCbm: 2,
      }).ok,
    ).toBe(false);
    expect(
      runWoodPricePerCbm({
        totalPriceEur: 600,
        volumeCbm: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric inputs", () =>
    expect(
      runWoodPricePerCbm({ totalPriceEur: 600, volumeCbm: "2" } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runWoodPricePerCbm({
      species: "beech",
      totalPriceEur: 600,
      volumeCbm: 2,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "unknown_field",
        field: "species",
        message: "species is not a supported input field.",
      });
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(woodPricePerCbmExample))).toEqual(
      woodPricePerCbmExample,
    );
    expect(woodPricePerCbmTool.id).toBe("carpentry/holzpreis-pro-cbm");
    expect(woodPricePerCbmTool.execution).toEqual({ kind: "pure" });
  });
});
