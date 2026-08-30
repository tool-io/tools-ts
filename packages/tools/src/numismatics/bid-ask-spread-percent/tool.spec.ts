import { describe, expect, it } from "vitest";
import {
  calculateBidAskSpreadPercent,
  example,
  runBidAskSpreadPercent,
} from "./tool.js";

describe("numismatics/bid-ask-spread-percent", () => {
  it("calculates the published example", () => {
    expect(calculateBidAskSpreadPercent(example.input)).toEqual(example.output);
    expect(runBidAskSpreadPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runBidAskSpreadPercent({
      ...example.input,
      askPrice: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero midpoint", () => {
    expect(runBidAskSpreadPercent({ askPrice: 0, bidPrice: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "askPrice" }] },
    });
  });
});
