import { describe, expect, it } from "vitest";
import { limitingReagentExample, runLimitingReagent } from "./tool.js";

describe("Limiting Reagent Finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLimitingReagent(limitingReagentExample.input)).toEqual({
      ok: true,
      output: limitingReagentExample.output,
    });
  });

  it("flags reactant B as limiting when scarce", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 5, reactantBMoles: 2, ratioAB: 2 }),
    ).toEqual({
      ok: true,
      output: { limitingReagent: "reactant-b", productMoles: 1 },
    });
  });

  it("breaks exact ties in favor of reactant A", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 2, reactantBMoles: 4, ratioAB: 2 }),
    ).toEqual({
      ok: true,
      output: { limitingReagent: "reactant-a", productMoles: 2 },
    });
  });

  it("supports fractional amounts", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 2, reactantBMoles: 3, ratioAB: 2 }),
    ).toEqual({
      ok: true,
      output: { limitingReagent: "reactant-b", productMoles: 1.5 },
    });
  });

  it("handles a one-to-one ratio", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 3, reactantBMoles: 7, ratioAB: 1 }),
    ).toEqual({
      ok: true,
      output: { limitingReagent: "reactant-a", productMoles: 3 },
    });
  });

  it("rejects a zero ratio", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 1, reactantBMoles: 1, ratioAB: 0 })
        .ok,
    ).toBe(false);
  });

  it("rejects non-positive reactant amounts", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 0, reactantBMoles: 1, ratioAB: 1 })
        .ok,
    ).toBe(false);
    expect(
      runLimitingReagent({ reactantAMoles: 1, reactantBMoles: -1, ratioAB: 1 })
        .ok,
    ).toBe(false);
  });

  it("requires all three inputs", () => {
    expect(
      runLimitingReagent({ reactantAMoles: 1, reactantBMoles: 1 }).ok,
    ).toBe(false);
    expect(runLimitingReagent({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runLimitingReagent(true).ok).toBe(false);
  });
});
