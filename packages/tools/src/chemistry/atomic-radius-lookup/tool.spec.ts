import { describe, expect, it } from "vitest";
import { runAtomicRadiusLookup } from "./tool.js";

describe("Atomic Radius Lookup", () => {
  it("returns 67 pm for carbon", () => {
    const r = runAtomicRadiusLookup({ element: "C" });
    if (!r.ok) throw new Error("fail");
    expect(r.output.radiusPm).toBe(67);
  });
  it("normalizes the element symbol case", () =>
    expect(runAtomicRadiusLookup({ element: "fe" })).toEqual({
      ok: true,
      output: { radiusPm: 156 },
    }));
  it("rejects an unknown element", () =>
    expect(runAtomicRadiusLookup({ element: "Xx" }).ok).toBe(false));
  it("rejects invalid input", () =>
    expect(runAtomicRadiusLookup(null).ok).toBe(false));
});
