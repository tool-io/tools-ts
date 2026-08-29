import { describe, expect, it } from "vitest";
import { runTransportNumber } from "./tool.js";

describe("Transport Number Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTransportNumber({
      cationConductivity: 1,
      anionConductivity: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.transportNumber).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runTransportNumber(null).ok).toBe(false));
});
