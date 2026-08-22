import { describe, expect, it } from "vitest";
import { runBpmToMs } from "./tool.js";

describe("BPM to Milliseconds Converter", () => {
  it("calculates a valid result", () => {
    expect(runBpmToMs({ bpm: 120 })).toEqual({
      ok: true,
      output: { millisecondsPerBeat: 500 },
    });
  });

  it("rejects invalid input", () => expect(runBpmToMs(null).ok).toBe(false));
});
