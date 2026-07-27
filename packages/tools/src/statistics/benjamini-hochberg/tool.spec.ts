import { describe, expect, it } from "vitest";
import {
  benjaminiHochbergExample,
  calculateBenjaminiHochberg,
} from "./tool.js";

describe("Benjamini-Hochberg", () => {
  it("controls FDR and restores input order", () => {
    expect(calculateBenjaminiHochberg({ pValues: [0.01, 0.04, 0.03] })).toEqual(
      {
        ok: true,
        output: { adjustedPValues: [0.03, 0.04, 0.04] },
      },
    );
  });

  it("rejects malformed input", () => {
    expect(calculateBenjaminiHochberg({ pValues: "a,b" })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes an executable example", () => {
    expect(calculateBenjaminiHochberg(benjaminiHochbergExample.input).ok).toBe(
      true,
    );
  });
});
