import { describe, expect, it } from "vitest";
import { alphaZeroPuctExample, runAlphaZeroPuct } from "./tool.js";
describe("AlphaZero PUCT", () => {
  it("publishes an executable example", () =>
    expect(runAlphaZeroPuct(alphaZeroPuctExample.input)).toEqual({
      ok: true,
      output: alphaZeroPuctExample.output,
    }));
});
