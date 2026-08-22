import { describe, expect, it } from "vitest";
import { runGoldenRatio } from "./tool.js";

describe("Golden Ratio Calculator", () => {
  it("splits a length into golden ratio segments", () => {
    expect(runGoldenRatio({ total: 100 })).toEqual({
      ok: true,
      output: { larger: 61.80339887498948, smaller: 38.19660112501052 },
    });
  });

  it("rejects invalid input", () =>
    expect(runGoldenRatio(null).ok).toBe(false));
});
