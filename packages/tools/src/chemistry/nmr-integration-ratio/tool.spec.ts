import { describe, expect, it } from "vitest";
import { runNmrIntegrationRatio } from "./tool.js";
describe("Integration Ratio", () => {
  it("calculates a valid result", () =>
    expect(
      runNmrIntegrationRatio({ integrationValueA: 3, integrationValueB: 2 }),
    ).toEqual({
      ok: true,
      output: { protonRatioA: 1.5, protonRatioB: 1 },
    }));
  it("rejects invalid input", () =>
    expect(
      runNmrIntegrationRatio({ integrationValueA: 0, integrationValueB: 2 }).ok,
    ).toBe(false));
});
