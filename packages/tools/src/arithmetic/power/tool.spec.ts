import { describe, expect, it } from "vitest";
import { runPower } from "./tool.js";

describe("Power Calculator", () => {
  it("raises a base to an exponent", () =>
    expect(runPower({ base: 2, exponent: -3 })).toEqual({
      ok: true,
      output: { power: 0.125 },
    }));

  it("rejects non-real or non-finite results", () => {
    expect(runPower({ base: -1, exponent: 0.5 }).ok).toBe(false);
    expect(runPower({ base: 0, exponent: -1 }).ok).toBe(false);
  });
});
