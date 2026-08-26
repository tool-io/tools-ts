import { describe, expect, it } from "vitest";
import { runVeneerMatchYield, veneerMatchYieldExample } from "./tool.js";

describe("veneer matching yield lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVeneerMatchYield(veneerMatchYieldExample.input)).toEqual({
      ok: true,
      output: veneerMatchYieldExample.output,
    });
  });

  it("returns sixty-five percent for random matching", () => {
    expect(runVeneerMatchYield({ matchType: "random" })).toEqual({
      ok: true,
      output: { typicalYieldPercent: 65 },
    });
  });

  it("returns eighty-five percent for sliding matching", () => {
    expect(runVeneerMatchYield({ matchType: "sliding" })).toEqual({
      ok: true,
      output: { typicalYieldPercent: 85 },
    });
  });

  it("returns seventy-five percent for mirrored matching", () => {
    expect(runVeneerMatchYield({ matchType: "mirrored" })).toEqual({
      ok: true,
      output: { typicalYieldPercent: 75 },
    });
  });

  it("covers every documented match type", () => {
    for (const matchType of ["random", "sliding", "mirrored"] as const) {
      const result = runVeneerMatchYield({ matchType });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects unknown match types", () => {
    const result = runVeneerMatchYield({ matchType: "wavy" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects differently cased match types", () => {
    expect(runVeneerMatchYield({ matchType: "Sliding" }).ok).toBe(false);
  });

  it("rejects non-string match types", () => {
    expect(runVeneerMatchYield({ matchType: 1 }).ok).toBe(false);
  });

  it("requires the match type", () => {
    expect(runVeneerMatchYield({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(runVeneerMatchYield({ matchType: "random", extra: true }).ok).toBe(
      false,
    );
  });
});
