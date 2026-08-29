import { describe, expect, it } from "vitest";
import { runTroutonRule } from "./tool.js";

describe("Trouton Rule Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTroutonRule({ boilingPointK: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.deltaHVapJPerMol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runTroutonRule(null).ok).toBe(false));
});
