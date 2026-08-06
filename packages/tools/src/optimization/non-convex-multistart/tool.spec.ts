import { describe, expect, it } from "vitest";
import {
  nonConvexMultistartExample,
  runNonConvexMultistart,
  solveNonConvexMultistart,
} from "./tool.js";

describe("Non-Convex Multistart", () => {
  it("finds a double-well minimum", () =>
    expect(
      solveNonConvexMultistart("double-well", -3, 3, 21, 200, 0.01)?.minimum,
    ).toBeLessThan(1e-12));
  it("rejects reversed bounds", () =>
    expect(
      runNonConvexMultistart({
        ...nonConvexMultistartExample.input,
        maximum: -4,
      }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runNonConvexMultistart(nonConvexMultistartExample.input)).toEqual({
      ok: true,
      output: nonConvexMultistartExample.output,
    }));
});
