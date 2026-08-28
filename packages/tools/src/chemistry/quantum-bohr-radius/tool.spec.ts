import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  bohrRadiusExample,
  bohrRadiusTool,
  calculateBohrRadius,
} from "./tool.js";

describe("Bohr radius", () => {
  it("reproduces the canonical example", () => {
    expect(calculateBohrRadius(bohrRadiusExample.input)).toEqual({
      ok: true,
      output: bohrRadiusExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(bohrRadiusTool)).toEqual([]);
  });

  it("rejects non-positive quantum numbers", () => {
    expect(
      calculateBohrRadius({ ...bohrRadiusExample.input, quantumNumber: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "positive_safe_integer_required" }] },
      ok: false,
    });
  });
});
