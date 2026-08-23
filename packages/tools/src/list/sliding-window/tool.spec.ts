import { describe, expect, it } from "vitest";
import {
  slidingWindowExample,
  calculateSlidingWindow,
  runSlidingWindow,
} from "./tool.js";

describe("list/sliding-window", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSlidingWindow(slidingWindowExample.input)).toEqual({
      ok: true,
      output: slidingWindowExample.output,
    });
  });
  it("rejects invalid input (windowSize)", () => {
    expect(runSlidingWindow({ values: [1], windowSize: 0 }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_window)", () => {
    expect(runSlidingWindow({ values: [1, 2], windowSize: 3 }).ok).toBe(false);
  });
  it("rejects invalid input (empty_list)", () => {
    expect(runSlidingWindow({ values: [], windowSize: 1 }).ok).toBe(false);
  });
  it("ends with the last full window", () => {
    const result = runSlidingWindow({
      values: [10, 20, 30, 40],
      windowSize: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.windows[result.output.windows.length - 1]).toEqual([
        30, 40,
      ]);
  });
});
