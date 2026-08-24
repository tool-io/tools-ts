import { describe, expect, it } from "vitest";
import {
  lineHeightRatioExample as example,
  runLineHeightRatio,
} from "./tool.js";

describe("Line Height Ratio Calculator", () => {
  it("executes its canonical example", () => {
    expect(runLineHeightRatio(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("computes a unitless ratio of one", () => {
    expect(runLineHeightRatio({ fontSizePx: 14, lineHeightPx: 14 })).toEqual({
      ok: true,
      output: { lineHeightRatio: 1 },
    });
  });

  it("computes a tight ratio below one", () => {
    expect(runLineHeightRatio({ fontSizePx: 20, lineHeightPx: 15 })).toEqual({
      ok: true,
      output: { lineHeightRatio: 0.75 },
    });
  });

  it("computes fractional ratios", () => {
    expect(runLineHeightRatio({ fontSizePx: 12, lineHeightPx: 18 })).toEqual({
      ok: true,
      output: { lineHeightRatio: 1.5 },
    });
  });

  it("rejects zero font size", () => {
    expect(
      runLineHeightRatio({ fontSizePx: 0, lineHeightPx: 24 }),
    ).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_value", field: "fontSizePx" }],
      },
      ok: false,
    });
  });

  it("rejects negative font size", () => {
    expect(runLineHeightRatio({ fontSizePx: -16, lineHeightPx: 24 }).ok).toBe(
      false,
    );
  });

  it("rejects zero line height", () => {
    expect(
      runLineHeightRatio({ fontSizePx: 16, lineHeightPx: 0 }),
    ).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_value", field: "lineHeightPx" }],
      },
      ok: false,
    });
  });

  it("rejects non-numeric font size with invalid_field", () => {
    expect(
      runLineHeightRatio({
        fontSizePx: null as unknown as number,
        lineHeightPx: 24,
      }),
    ).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_field", field: "fontSizePx" }],
      },
      ok: false,
    });
  });

  it("rejects non-numeric line height", () => {
    expect(
      runLineHeightRatio({
        fontSizePx: 16,
        lineHeightPx: Infinity,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runLineHeightRatio({
        extra: 1,
        fontSizePx: 16,
        lineHeightPx: 24,
      } as { fontSizePx: number; lineHeightPx: number }).ok,
    ).toBe(false);
  });
});
