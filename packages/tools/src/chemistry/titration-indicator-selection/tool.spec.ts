import { describe, expect, it } from "vitest";
import { runTitrationIndicatorSelection } from "./tool.js";
describe("Titration Indicator Selection Tool", () => {
  it("selects bromothymol blue for neutral pH", () => {
    expect(runTitrationIndicatorSelection({ equivalencePh: 7 })).toEqual({
      ok: true,
      output: { indicator: "bromothymol blue" },
    });
  });
  it("rejects invalid input", () =>
    expect(runTitrationIndicatorSelection(null).ok).toBe(false));
});
