import { describe, expect, it } from "vitest";
import { runCoprimeCount } from "./tool.js";

describe("Coprime Count Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCoprimeCount({ value: 12 })).toEqual({
      ok: true,
      output: { coprimes: 4 },
    });
    expect(runCoprimeCount({ value: 13 })).toEqual({
      ok: true,
      output: { coprimes: 12 },
    });
    expect(runCoprimeCount({ value: 1 })).toEqual({
      ok: true,
      output: { coprimes: 1 },
    });
  });

  it("rejects invalid input", () =>
    expect(runCoprimeCount(null).ok).toBe(false));
});
