import { describe, expect, it } from "vitest";
import { runStandardEntropyFormation } from "./tool.js";
describe("Entropy Contribution", () => {
  it("calculates a valid result", () =>
    expect(
      runStandardEntropyFormation({
        moles: 3,
        standardEntropyJPerMolK: 205,
      }),
    ).toEqual({
      ok: true,
      output: { entropyContributionJPerK: 615 },
    }));
  it("rejects invalid input", () =>
    expect(
      runStandardEntropyFormation({
        moles: -1,
        standardEntropyJPerMolK: 205,
      }).ok,
    ).toBe(false));
});
