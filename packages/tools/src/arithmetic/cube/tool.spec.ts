import { describe, expect, it } from "vitest";
import { runCube } from "./tool.js";
describe("Cube Calculator", () => {
  it("calculates a valid result", () =>
    expect(runCube({ value: 3 })).toEqual({ ok: true, output: { cube: 27 } }));
  it("rejects invalid input", () => expect(runCube(null).ok).toBe(false));
});
