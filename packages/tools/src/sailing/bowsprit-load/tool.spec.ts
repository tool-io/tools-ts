import { describe, expect, it } from "vitest";
import { bowspritLoadExample, runBowspritLoad } from "./tool.js";

describe("Bowsprit Compression Load", () => {
  it("calculates the canonical example", () => {
    const result = runBowspritLoad(bowspritLoadExample.input);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.bowspritCompressionNewtons).toBeCloseTo(10000, 6);
  });
  it("reduces compression as the deck angle steepens", () => {
    const shallow = runBowspritLoad({
      deckAngleDeg: 20,
      forestayLoadNewtons: 5000,
    });
    const steep = runBowspritLoad({
      deckAngleDeg: 40,
      forestayLoadNewtons: 5000,
    });
    if (!shallow.ok || !steep.ok) throw new Error("Expected success.");
    expect(shallow.output.bowspritCompressionNewtons).toBeGreaterThan(
      Number(steep.output.bowspritCompressionNewtons),
    );
  });
  it("yields zero compression for a slack forestay", () =>
    expect(
      runBowspritLoad({ deckAngleDeg: 30, forestayLoadNewtons: 0 }),
    ).toEqual({ ok: true, output: { bowspritCompressionNewtons: 0 } }));
  it("accepts a shallow positive deck angle", () => {
    const result = runBowspritLoad({
      deckAngleDeg: 5,
      forestayLoadNewtons: 5000,
    });
    expect(result.ok).toBe(true);
  });
  it("accepts a deck angle of exactly 45 degrees", () => {
    const result = runBowspritLoad({
      deckAngleDeg: 45,
      forestayLoadNewtons: 5000,
    });
    expect(result.ok).toBe(true);
  });
  it("accepts angles through ninety degrees", () => {
    expect(
      runBowspritLoad({ deckAngleDeg: 4, forestayLoadNewtons: 5000 }).ok,
    ).toBe(true);
    expect(
      runBowspritLoad({ deckAngleDeg: 90, forestayLoadNewtons: 5000 }).ok,
    ).toBe(true);
  });
  it("rejects negative forestay loads", () =>
    expect(
      runBowspritLoad({ deckAngleDeg: 30, forestayLoadNewtons: -1 }).ok,
    ).toBe(false));
  it("rejects missing and malformed input", () => {
    expect(runBowspritLoad({ forestayLoadNewtons: 5000 }).ok).toBe(false);
    expect(
      runBowspritLoad({ deckAngleDeg: "30", forestayLoadNewtons: 5000 }).ok,
    ).toBe(false);
    expect(runBowspritLoad(null).ok).toBe(false);
  });
});
