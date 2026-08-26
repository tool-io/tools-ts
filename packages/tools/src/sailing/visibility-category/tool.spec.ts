import { describe, expect, it } from "vitest";
import { runVisibilityCategory, visibilityCategoryExample } from "./tool.js";

describe("Visibility Category Lookup", () => {
  it("calculates the canonical example exactly", () => {
    expect(runVisibilityCategory(visibilityCategoryExample.input)).toEqual({
      ok: true,
      output: { category: "poor" },
    });
  });

  it("classifies visibility under half a mile as fog", () => {
    expect(runVisibilityCategory({ visibilityNm: 0 })).toEqual({
      ok: true,
      output: { category: "fog" },
    });
    expect(runVisibilityCategory({ visibilityNm: 0.49 })).toEqual({
      ok: true,
      output: { category: "fog" },
    });
  });

  it("keeps half a mile poor and two miles moderate", () => {
    expect(runVisibilityCategory({ visibilityNm: 0.5 })).toEqual({
      ok: true,
      output: { category: "poor" },
    });
    expect(runVisibilityCategory({ visibilityNm: 2 })).toEqual({
      ok: true,
      output: { category: "moderate" },
    });
  });

  it("keeps five miles good and beyond", () => {
    expect(runVisibilityCategory({ visibilityNm: 4.99 })).toEqual({
      ok: true,
      output: { category: "moderate" },
    });
    expect(runVisibilityCategory({ visibilityNm: 5 })).toEqual({
      ok: true,
      output: { category: "good" },
    });
    expect(runVisibilityCategory({ visibilityNm: 20 })).toEqual({
      ok: true,
      output: { category: "good" },
    });
  });

  it("accepts zero visibility as fog", () => {
    expect(runVisibilityCategory({ visibilityNm: 0 }).ok).toBe(true);
  });

  it("rejects negative visibility at the schema level", () => {
    expect(runVisibilityCategory({ visibilityNm: -0.1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "visibilityNm" }] },
      ok: false,
    });
  });

  it("rejects non-finite visibility", () => {
    expect(runVisibilityCategory({ visibilityNm: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runVisibilityCategory({ fog: true, visibilityNm: 1.2 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "fog" }] },
      ok: false,
    });
    expect(runVisibilityCategory(null).ok).toBe(false);
    expect(runVisibilityCategory({}).ok).toBe(false);
  });
});
