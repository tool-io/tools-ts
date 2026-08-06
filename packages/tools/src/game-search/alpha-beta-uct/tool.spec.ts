import { describe, expect, it } from "vitest";
import { alphaBetaUctExample, runAlphaBetaUct } from "./tool.js";
describe("alpha-beta UCT", () => {
  it("publishes an executable example", () =>
    expect(runAlphaBetaUct(alphaBetaUctExample.input)).toEqual({
      ok: true,
      output: alphaBetaUctExample.output,
    }));
});
