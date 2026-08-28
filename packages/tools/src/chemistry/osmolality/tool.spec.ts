import { describe, expect, it } from "vitest";
import { runOsmolality } from "./tool.js";

describe("Osmolality Calculator", () => {
  it("calculates a valid result", () => {
    expect(runOsmolality({ molalityMolKg: 0.5, vantHoffFactor: 3 })).toEqual({
      ok: true,
      output: { osmolalityOsmKg: 1.5 },
    });
  });

  it("rejects invalid input", () => expect(runOsmolality(null).ok).toBe(false));
});
