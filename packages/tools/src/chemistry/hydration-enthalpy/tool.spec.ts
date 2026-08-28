import { describe, expect, it } from "vitest";
import { runHydrationEnthalpy } from "./tool.js";
describe("Hydration Enthalpy Sum", () => {
  it("calculates a valid result", () =>
    expect(
      runHydrationEnthalpy({ ionHydrationKJPerMol: -365, moles: 2 }),
    ).toEqual({
      ok: true,
      output: { hydrationEnthalpyKJ: -730 },
    }));
  it("rejects invalid input", () =>
    expect(
      runHydrationEnthalpy({ ionHydrationKJPerMol: -365, moles: 0 }).ok,
    ).toBe(false));
});
