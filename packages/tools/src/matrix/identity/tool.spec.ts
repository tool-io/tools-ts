import { describe, expect, it } from "vitest";
import { runIdentity } from "./tool.js";
describe("Identity Matrix Generator", () => {
  it("calculates a valid result", () => {
    expect(runIdentity({ size: 2 })).toEqual({
      ok: true,
      output: {
        matrix: [
          [1, 0],
          [0, 1],
        ],
      },
    });
  });
  it("rejects invalid input", () => expect(runIdentity(null).ok).toBe(false));
});
