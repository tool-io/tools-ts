import { describe, expect, it } from "vitest";
import { runGammaCpCv } from "./tool.js";

describe("Gamma Cp/Cv Calculator", () => {
  it("calculates a valid result", () => {
    const result = runGammaCpCv({ cp: 1, cv: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gamma).toBeDefined();
  });
  it("rejects invalid input", () => expect(runGammaCpCv(null).ok).toBe(false));
});
