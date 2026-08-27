import { describe, expect, it } from "vitest";
import { runSequenceLength } from "./tool.js";

describe("Sequence Length", () => {
  it("calculates a valid result", () =>
    expect(runSequenceLength({ sequence: "ATGCAG" })).toEqual({
      ok: true,
      output: { length: 6 },
    }));
  it("returns zero for an empty sequence", () =>
    expect(runSequenceLength({ sequence: "" })).toEqual({
      ok: true,
      output: { length: 0 },
    }));
  it("handles a single character", () =>
    expect(runSequenceLength({ sequence: "A" })).toEqual({
      ok: true,
      output: { length: 1 },
    }));
  it("passes longer sequences through", () =>
    expect(runSequenceLength({ sequence: "ACGTACGTACGTACGTACGT" })).toEqual({
      ok: true,
      output: { length: 20 },
    }));
  it("counts every character", () =>
    expect(runSequenceLength({ sequence: "NNNN" })).toEqual({
      ok: true,
      output: { length: 4 },
    }));
  it("counts whitespace characters too", () =>
    expect(runSequenceLength({ sequence: "AC GT\n" })).toEqual({
      ok: true,
      output: { length: 6 },
    }));
});
