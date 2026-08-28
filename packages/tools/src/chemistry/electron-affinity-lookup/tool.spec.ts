import { describe, expect, it } from "vitest";
import { runElectronAffinityLookup } from "./tool.js";

describe("Electron Affinity Lookup", () => {
  it("returns 328 for fluorine", () => {
    const r = runElectronAffinityLookup({ element: "F" });
    if (!r.ok) throw new Error("fail");
    expect(r.output.electronAffinityKJPerMol).toBe(328);
  });
  it("rejects invalid input", () =>
    expect(runElectronAffinityLookup(null).ok).toBe(false));
});
