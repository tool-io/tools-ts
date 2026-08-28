import { describe, expect, it } from "vitest";
import { runHybridization } from "./tool.js";

describe("Hybridization Lookup", () => {
  it("maps steric numbers to hybridizations", () => {
    for (const [stericNumber, expected] of [
      [2, "sp"],
      [3, "sp2"],
      [4, "sp3"],
      [5, "sp3d"],
      [6, "sp3d2"],
    ] as const) {
      expect(runHybridization({ stericNumber })).toEqual({
        ok: true,
        output: { hybridization: expected },
      });
    }
  });

  it("rejects invalid input", () =>
    expect(runHybridization(null).ok).toBe(false));
});
