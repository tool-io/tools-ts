import { describe, expect, it } from "vitest";
import { clamexPatternExample, runClamexPattern } from "./tool.js";

describe("Clamex P Drilling Pattern", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runClamexPattern(clamexPatternExample.input)).toEqual({
      ok: true,
      output: clamexPatternExample.output,
    });
  });

  it("looks up the p-10 pattern", () => {
    expect(runClamexPattern({ model: "p-10" })).toEqual({
      ok: true,
      output: {
        accessHoleDiameterMm: 6,
        grooveDepthMm: 10,
        minimumButtJointThicknessMm: 12,
        minimumMiterThicknessMm: 15,
      },
    });
  });

  it("looks up the p-14 pattern", () => {
    expect(runClamexPattern({ model: "p-14" })).toEqual({
      ok: true,
      output: {
        accessHoleDiameterMm: 6,
        grooveDepthMm: 14,
        minimumButtJointThicknessMm: 15,
        minimumMiterThicknessMm: 18,
      },
    });
  });

  it("covers every documented model", () => {
    for (const model of ["p-10", "p-14"] as const) {
      const result = runClamexPattern({ model });
      expect(result.ok).toBe(true);
    }
  });

  it("keeps the access-hole diameter constant across models", () => {
    for (const model of ["p-10", "p-14"] as const) {
      const result = runClamexPattern({ model });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.accessHoleDiameterMm).toBe(6);
    }
  });

  it("rejects unknown models", () => {
    const result = runClamexPattern({ model: "p-15" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("model");
  });

  it("rejects differently cased models", () => {
    expect(runClamexPattern({ model: "P-10" }).ok).toBe(false);
  });

  it("requires the model", () => {
    expect(runClamexPattern({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runClamexPattern({ extra: true, model: "p-14" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
