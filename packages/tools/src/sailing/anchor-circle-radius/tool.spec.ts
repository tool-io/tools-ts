import { describe, expect, it } from "vitest";
import { anchorCircleRadiusExample, runAnchorCircleRadius } from "./tool.js";

describe("Anchor Circle Radius Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runAnchorCircleRadius(anchorCircleRadiusExample.input)).toEqual({
      ok: true,
      output: { anchorCircleRadiusMeters: 56 },
    });
  });

  it("defaults the scope ratio to seven when omitted", () => {
    expect(runAnchorCircleRadius({ waterDepthMeters: 10 })).toEqual({
      ok: true,
      output: { anchorCircleRadiusMeters: 70 },
    });
  });

  it("equals the depth at the minimum scope of one", () => {
    expect(
      runAnchorCircleRadius({
        anchorScopeRatio: 1,
        waterDepthMeters: 5,
      }),
    ).toEqual({ ok: true, output: { anchorCircleRadiusMeters: 5 } });
  });

  it("multiplies depth by the selected scope ratio", () => {
    expect(
      runAnchorCircleRadius({
        anchorScopeRatio: 15,
        waterDepthMeters: 5,
      }),
    ).toEqual({ ok: true, output: { anchorCircleRadiusMeters: 75 } });
  });

  it("accepts fractional scope ratios", () => {
    expect(
      runAnchorCircleRadius({
        anchorScopeRatio: 2.5,
        waterDepthMeters: 3,
      }),
    ).toEqual({ ok: true, output: { anchorCircleRadiusMeters: 7.5 } });
  });

  it("rejects a scope ratio above fifteen", () => {
    expect(
      runAnchorCircleRadius({
        anchorScopeRatio: 15.1,
        waterDepthMeters: 8,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "anchorScopeRatio" }],
      },
      ok: false,
    });
  });

  it("rejects a scope ratio below one", () => {
    expect(
      runAnchorCircleRadius({
        anchorScopeRatio: 0.5,
        waterDepthMeters: 8,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero depth with a stable error", () => {
    expect(
      runAnchorCircleRadius({
        anchorScopeRatio: 7,
        waterDepthMeters: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "waterDepthMeters" }] },
      ok: false,
    });
  });

  it("rejects negative depth", () => {
    expect(runAnchorCircleRadius({ waterDepthMeters: -2 }).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runAnchorCircleRadius({
        chainLengthMeters: 50,
        waterDepthMeters: 8,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "unknown_field", field: "chainLengthMeters" }],
      },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runAnchorCircleRadius(null).ok).toBe(false);
    expect(runAnchorCircleRadius({}).ok).toBe(false);
  });
});
