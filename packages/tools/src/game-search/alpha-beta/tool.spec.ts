import { describe, expect, it } from "vitest";
import { alphaBetaExample, runAlphaBeta } from "./tool.js";
describe("alpha-beta", () => {
  it("publishes an executable example", () =>
    expect(runAlphaBeta(alphaBetaExample.input)).toEqual({
      ok: true,
      output: alphaBetaExample.output,
    }));
  it("rejects malformed leaves", () =>
    expect(runAlphaBeta({ maximizing: true, tree: { value: "3" } }).ok).toBe(
      false,
    ));
});
