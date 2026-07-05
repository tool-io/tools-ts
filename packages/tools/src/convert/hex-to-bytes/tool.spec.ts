import { describe, expect, it } from "vitest";
import { runHexToBytes } from "./tool.js";
describe("Hex to Bytes Converter", () => {
  it("calculates a valid result", () => {
    expect(runHexToBytes({ hex: "4869" })).toEqual({
      ok: true,
      output: { bytes: "SGk=" },
    });
  });
  it("rejects invalid input", () =>
    expect(runHexToBytes({ hex: "xyz" }).ok).toBe(false));
});
