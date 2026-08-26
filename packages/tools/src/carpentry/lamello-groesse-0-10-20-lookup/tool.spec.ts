import { describe, expect, it } from "vitest";
import { biscuitSizeLookupExample, runBiscuitSizeLookup } from "./tool.js";

describe("Biscuit Size Lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBiscuitSizeLookup(biscuitSizeLookupExample.input)).toEqual({
      ok: true,
      output: biscuitSizeLookupExample.output,
    });
  });

  it("looks up size 0", () => {
    expect(runBiscuitSizeLookup({ size: "0" })).toEqual({
      ok: true,
      output: { heightMm: 15, thicknessMm: 4, widthMm: 47 },
    });
  });

  it("looks up size 10", () => {
    expect(runBiscuitSizeLookup({ size: "10" })).toEqual({
      ok: true,
      output: { heightMm: 22, thicknessMm: 4, widthMm: 53 },
    });
  });

  it("covers every documented size with a constant thickness of four millimeters", () => {
    for (const size of ["0", "10", "20"] as const) {
      const result = runBiscuitSizeLookup({ size });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.thicknessMm).toBe(4);
    }
  });

  it("rejects unknown sizes", () => {
    const result = runBiscuitSizeLookup({ size: "25" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("size");
  });

  it("rejects differently cased sizes", () => {
    expect(runBiscuitSizeLookup({ size: "ZERO" }).ok).toBe(false);
  });

  it("rejects numeric sizes", () => {
    expect(runBiscuitSizeLookup({ size: 20 }).ok).toBe(false);
  });

  it("requires the size", () => {
    expect(runBiscuitSizeLookup({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runBiscuitSizeLookup({ extra: true, size: "10" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
