import { describe, expect, it } from "vitest";
import {
  calculateCurrentRatio,
  currentRatioExample,
  runCurrentRatio,
} from "./tool.js";

describe("Current Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCurrentRatio(currentRatioExample.input)).toEqual({
      ok: true,
      output: currentRatioExample.output,
    });
  });

  it("calculates a ratio above one for another valid input", () => {
    expect(
      calculateCurrentRatio({
        currentAssets: 250000,
        currentLiabilities: 125000,
      }),
    ).toEqual({ currentRatio: 2 });
  });

  it("reports a ratio below one when liabilities exceed assets", () => {
    expect(
      calculateCurrentRatio({
        currentAssets: 80000,
        currentLiabilities: 160000,
      }),
    ).toEqual({ currentRatio: 0.5 });
  });

  it("allows negative current assets", () => {
    expect(
      runCurrentRatio({ currentAssets: -50000, currentLiabilities: 100000 }),
    ).toEqual({ ok: true, output: { currentRatio: -0.5 } });
  });

  it("rejects zero liabilities with invalid_current_liabilities", () => {
    expect(
      runCurrentRatio({ currentAssets: 150000, currentLiabilities: 0 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_current_liabilities", field: "currentLiabilities" },
        ],
      },
      ok: false,
    });
  });

  it("rejects negative liabilities with invalid_current_liabilities", () => {
    expect(
      runCurrentRatio({ currentAssets: 150000, currentLiabilities: -100000 })
        .ok,
    ).toBe(false);
  });

  it("rejects non-finite input", () => {
    const result = runCurrentRatio({
      currentAssets: Number.POSITIVE_INFINITY,
      currentLiabilities: 100000,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "currentAssets" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runCurrentRatio({
        currentAssets: 1,
        currentLiabilities: 2,
        extra: 3,
      }).ok,
    ).toBe(false);
  });
});
