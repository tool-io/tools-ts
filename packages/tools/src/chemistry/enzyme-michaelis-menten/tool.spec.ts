import { describe, expect, it } from "vitest";
import { runEnzymeMichaelisMenten } from "./tool.js";

describe("Michaelis-Menten Rate Calculator", () => {
  it("calculates a valid result", () => {
    const result = runEnzymeMichaelisMenten({ vmax: 1, substrateS: 1, km: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.velocityV).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runEnzymeMichaelisMenten(null).ok).toBe(false));
});
