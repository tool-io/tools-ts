import { describe, expect, it } from "vitest";
import { rafixPatternExample, runRafixPattern } from "./tool.js";

describe("Rafix Drilling Pattern", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRafixPattern(rafixPatternExample.input)).toEqual({
      ok: true,
      output: rafixPatternExample.output,
    });
  });

  it("looks up the rafix-20 pattern", () => {
    expect(runRafixPattern({ system: "rafix-20" })).toEqual({
      ok: true,
      output: { camDiameterMm: 20, drillingDepthMm: 12.5, edgeDistanceMm: 34 },
    });
  });

  it("covers every documented system", () => {
    for (const system of ["rafix-20", "rafix-22"] as const) {
      const result = runRafixPattern({ system });
      expect(result.ok).toBe(true);
    }
  });

  it("keeps the edge distance constant across systems", () => {
    for (const system of ["rafix-20", "rafix-22"] as const) {
      const result = runRafixPattern({ system });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.edgeDistanceMm).toBe(34);
    }
  });

  it("rejects unknown systems", () => {
    const result = runRafixPattern({ system: "rafix-25" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("system");
  });

  it("rejects differently cased systems", () => {
    expect(runRafixPattern({ system: "RAFIX-20" }).ok).toBe(false);
  });

  it("requires the system", () => {
    expect(runRafixPattern({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runRafixPattern({ extra: true, system: "rafix-20" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runRafixPattern(undefined).ok).toBe(false);
  });
});
