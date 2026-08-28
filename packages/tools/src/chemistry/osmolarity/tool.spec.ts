import { describe, expect, it } from "vitest";
import { runOsmolarity } from "./tool.js";

describe("Osmolarity Calculator", () => {
  it("calculates a valid result", () => {
    expect(runOsmolarity({ molarityMolL: 0.25, vantHoffFactor: 2 })).toEqual({
      ok: true,
      output: { osmolarityOsmL: 0.5 },
    });
  });

  it("rejects invalid input", () => expect(runOsmolarity(null).ok).toBe(false));
});
