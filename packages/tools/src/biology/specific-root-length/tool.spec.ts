import { describe, expect, it } from "vitest";
import { runSpecificRootLength, specificRootLengthExample } from "./tool.js";

describe("Specific Root Length", () => {
  it("publishes an executable example", () =>
    expect(runSpecificRootLength(specificRootLengthExample.input)).toEqual({
      ok: true,
      output: specificRootLengthExample.output,
    }));
  it("doubles when length doubles at fixed mass", () =>
    expect(
      runSpecificRootLength({ rootDryMassG: 0.5, rootLengthMeters: 50 }),
    ).toEqual({ ok: true, output: { specificRootLength: 100 } }));
  it("doubles when mass halves at fixed length", () =>
    expect(
      runSpecificRootLength({ rootDryMassG: 0.25, rootLengthMeters: 25 }),
    ).toEqual({ ok: true, output: { specificRootLength: 100 } }));
  it("returns one for balanced length and mass", () =>
    expect(
      runSpecificRootLength({ rootDryMassG: 4, rootLengthMeters: 4 }),
    ).toEqual({ ok: true, output: { specificRootLength: 1 } }));
  it("rejects zero root length", () => {
    const result = runSpecificRootLength({
      rootDryMassG: 0.5,
      rootLengthMeters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("rootLengthMeters");
  });
  it("rejects zero dry mass", () => {
    const result = runSpecificRootLength({
      rootDryMassG: 0,
      rootLengthMeters: 25,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("rootDryMassG");
  });
  it("rejects negative inputs", () => {
    const result = runSpecificRootLength({
      rootDryMassG: -1,
      rootLengthMeters: 25,
    });
    expect(result.ok).toBe(false);
  });
});
