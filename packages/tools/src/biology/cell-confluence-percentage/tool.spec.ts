import { describe, expect, it } from "vitest";
import {
  cellConfluencePercentageExample,
  runCellConfluencePercentage,
} from "./tool.js";

describe("Confluence %", () => {
  it("matches the canonical example", () => {
    expect(
      runCellConfluencePercentage(cellConfluencePercentageExample.input),
    ).toEqual({ ok: true, output: cellConfluencePercentageExample.output });
  });
  it("computes full confluence", () =>
    expect(
      runCellConfluencePercentage({
        flaskAreaCm2: 12.5,
        occupiedAreaCm2: 12.5,
      }),
    ).toEqual({ ok: true, output: { confluencePercent: 100 } }));
  it("computes partial coverage", () =>
    expect(
      runCellConfluencePercentage({ flaskAreaCm2: 80, occupiedAreaCm2: 20 }),
    ).toEqual({ ok: true, output: { confluencePercent: 25 } }));
  it("allows an empty flask", () =>
    expect(
      runCellConfluencePercentage({ flaskAreaCm2: 9, occupiedAreaCm2: 0 }),
    ).toEqual({ ok: true, output: { confluencePercent: 0 } }));
  it("rejects occupied area above flask area", () =>
    expect(
      runCellConfluencePercentage({ flaskAreaCm2: 5, occupiedAreaCm2: 6 }).ok,
    ).toBe(false));
  it("rejects zero flask area", () =>
    expect(
      runCellConfluencePercentage({ flaskAreaCm2: 0, occupiedAreaCm2: 1 }).ok,
    ).toBe(false));
  it("rejects negative flask area", () =>
    expect(
      runCellConfluencePercentage({ flaskAreaCm2: -2, occupiedAreaCm2: 1 }).ok,
    ).toBe(false));
  it("rejects negative occupied area", () =>
    expect(
      runCellConfluencePercentage({ flaskAreaCm2: 25, occupiedAreaCm2: -1 }).ok,
    ).toBe(false));
});
