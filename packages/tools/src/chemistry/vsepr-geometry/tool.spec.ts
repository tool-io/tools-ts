import { describe, expect, it } from "vitest";
import { runVseprGeometry } from "./tool.js";

describe("VSEPR Geometry Lookup", () => {
  it("looks up common shapes", () => {
    expect(runVseprGeometry({ bondedAtoms: 4, lonePairs: 0 })).toEqual({
      ok: true,
      output: { geometry: "tetrahedral" },
    });
    expect(runVseprGeometry({ bondedAtoms: 3, lonePairs: 1 })).toEqual({
      ok: true,
      output: { geometry: "trigonal pyramidal" },
    });
    expect(runVseprGeometry({ bondedAtoms: 2, lonePairs: 2 })).toEqual({
      ok: true,
      output: { geometry: "bent" },
    });
    expect(runVseprGeometry({ bondedAtoms: 2, lonePairs: 3 })).toEqual({
      ok: true,
      output: { geometry: "linear" },
    });
  });

  it("rejects unsupported combinations through execution", () => {
    expect(runVseprGeometry({ bondedAtoms: 0, lonePairs: 9 })).toMatchObject({
      error: { issues: [{ code: "unsupported_geometry" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runVseprGeometry(null).ok).toBe(false));
});
