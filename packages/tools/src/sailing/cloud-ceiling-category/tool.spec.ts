import { describe, expect, it } from "vitest";
import {
  cloudCeilingCategoryExample,
  runCloudCeilingCategory,
} from "./tool.js";

describe("Ceiling Category Lookup", () => {
  it("calculates the canonical example exactly", () => {
    expect(runCloudCeilingCategory(cloudCeilingCategoryExample.input)).toEqual({
      ok: true,
      output: { category: "marginal" },
    });
  });

  it("classifies ceilings below five hundred feet as low", () => {
    expect(runCloudCeilingCategory({ ceilingFt: 0 })).toEqual({
      ok: true,
      output: { category: "low" },
    });
    expect(runCloudCeilingCategory({ ceilingFt: 499 })).toEqual({
      ok: true,
      output: { category: "low" },
    });
  });

  it("keeps exactly five hundred feet marginal", () => {
    expect(runCloudCeilingCategory({ ceilingFt: 500 })).toEqual({
      ok: true,
      output: { category: "marginal" },
    });
  });

  it("classifies ceilings below three thousand feet as marginal", () => {
    expect(runCloudCeilingCategory({ ceilingFt: 2999 })).toEqual({
      ok: true,
      output: { category: "marginal" },
    });
  });

  it("keeps exactly three thousand feet and above ok", () => {
    expect(runCloudCeilingCategory({ ceilingFt: 3000 })).toEqual({
      ok: true,
      output: { category: "ok" },
    });
    expect(runCloudCeilingCategory({ ceilingFt: 12000 })).toEqual({
      ok: true,
      output: { category: "ok" },
    });
  });

  it("rejects negative or fractional ceilings at the schema level", () => {
    expect(runCloudCeilingCategory({ ceilingFt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ceilingFt" }] },
      ok: false,
    });
    expect(runCloudCeilingCategory({ ceilingFt: 900.5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ceilingFt" }] },
      ok: false,
    });
  });

  it("rejects non-finite ceilings", () => {
    expect(runCloudCeilingCategory({ ceilingFt: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runCloudCeilingCategory({ ceilingFt: 900, layer: "stratus" }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "layer" }] },
      ok: false,
    });
    expect(runCloudCeilingCategory(null).ok).toBe(false);
    expect(runCloudCeilingCategory({}).ok).toBe(false);
  });
});
