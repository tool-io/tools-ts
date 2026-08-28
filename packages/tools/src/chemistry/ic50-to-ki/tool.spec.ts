import { describe, expect, it } from "vitest";
import { runIc50ToKi } from "./tool.js";

describe("IC50 to Ki Converter", () => {
  it("calculates a valid result", () => {
    const result = runIc50ToKi({
      ic50MolL: 1,
      substrateKmMolL: 1,
      substrateConcMolL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.kiMolL).toBeDefined();
  });
  it("rejects invalid input", () => expect(runIc50ToKi(null).ok).toBe(false));
});
