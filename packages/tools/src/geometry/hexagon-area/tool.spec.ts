import { describe, expect, it } from "vitest";
import { runHexagonArea } from "./tool.js";

describe("Regular Hexagon Area Calculator", () => {
  it("calculates a valid result", () => {
    expect(runHexagonArea({ side: 2 })).toEqual({
      ok: true,
      output: { area: expect.closeTo(10.392304845413264, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runHexagonArea(null).ok).toBe(false));
});
