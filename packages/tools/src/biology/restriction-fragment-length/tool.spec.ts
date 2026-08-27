import { describe, expect, it } from "vitest";
import { runRestrictionFragmentLength } from "./tool.js";

describe("Fragment Lengths Count", () => {
  it("calculates a valid result", () =>
    expect(runRestrictionFragmentLength({ cutSites: 4 })).toEqual({
      ok: true,
      output: { fragmentCount: 5 },
    }));
  it("returns a single fragment without cuts", () =>
    expect(runRestrictionFragmentLength({ cutSites: 0 })).toEqual({
      ok: true,
      output: { fragmentCount: 1 },
    }));
  it("yields two fragments per single cut", () =>
    expect(runRestrictionFragmentLength({ cutSites: 1 })).toEqual({
      ok: true,
      output: { fragmentCount: 2 },
    }));
  it("counts fragments for dense cutting", () =>
    expect(runRestrictionFragmentLength({ cutSites: 24 })).toEqual({
      ok: true,
      output: { fragmentCount: 25 },
    }));
  it("rejects negative cut sites", () =>
    expect(runRestrictionFragmentLength({ cutSites: -2 }).ok).toBe(false));
  it("rejects fractional cut sites", () =>
    expect(runRestrictionFragmentLength({ cutSites: 3.5 }).ok).toBe(false));
});
