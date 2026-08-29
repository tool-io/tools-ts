import { describe, expect, it } from "vitest";
import {
  electrochemicalEquivalentExample,
  runElectrochemicalEquivalent,
} from "./tool.js";

describe("Electrochemical Equivalent Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runElectrochemicalEquivalent(electrochemicalEquivalentExample.input),
    ).toEqual({
      ok: true,
      output: electrochemicalEquivalentExample.output,
    });
  });
  it("rejects invalid input", () =>
    expect(runElectrochemicalEquivalent(null).ok).toBe(false));
});
