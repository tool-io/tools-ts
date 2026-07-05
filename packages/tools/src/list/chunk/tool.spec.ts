import { describe, expect, it } from "vitest";
import { runChunk } from "./tool.js";
describe("List Chunk Tool", () => {
  it("calculates a valid result", () => {
    expect(runChunk({ values: ["a", "b", "c"], size: 2 })).toEqual({
      ok: true,
      output: { chunks: { values: [["a", "b"], ["c"]] } },
    });
  });
  it("rejects invalid input", () => expect(runChunk(null).ok).toBe(false));
});
