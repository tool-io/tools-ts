import { describe, expect, it } from "vitest";
import { runPrimerLength } from "./tool.js";

describe("Primer Length Check", () => {
  it("calculates a valid result", () =>
    expect(runPrimerLength({ length: 22 })).toEqual({
      ok: true,
      output: { optimal: true, length: 22 },
    }));
  it("accepts the lower boundary", () =>
    expect(runPrimerLength({ length: 18 })).toEqual({
      ok: true,
      output: { optimal: true, length: 18 },
    }));
  it("accepts the upper boundary", () =>
    expect(runPrimerLength({ length: 25 })).toEqual({
      ok: true,
      output: { optimal: true, length: 25 },
    }));
  it("rejects below the range", () =>
    expect(runPrimerLength({ length: 17 })).toEqual({
      ok: true,
      output: { optimal: false, length: 17 },
    }));
  it("rejects above the range", () =>
    expect(runPrimerLength({ length: 26 })).toEqual({
      ok: true,
      output: { optimal: false, length: 26 },
    }));
  it("echoes long lengths back", () =>
    expect(runPrimerLength({ length: 30 })).toEqual({
      ok: true,
      output: { optimal: false, length: 30 },
    }));
  it("rejects fractional lengths", () =>
    expect(runPrimerLength({ length: 20.5 }).ok).toBe(false));
});
