import { describe, expect, it } from "vitest";
import { runElectronegativityLookup } from "./tool.js";

describe("Electronegativity Lookup", () => {
  it("returns 3.44 for oxygen", () => {
    const r = runElectronegativityLookup({ element: "O" });
    if (!r.ok) throw new Error("fail");
    expect(r.output.value).toBe(3.44);
  });
  it("rejects invalid input", () =>
    expect(runElectronegativityLookup(null).ok).toBe(false));
});
