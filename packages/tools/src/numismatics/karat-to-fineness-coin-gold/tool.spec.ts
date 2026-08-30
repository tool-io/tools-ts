import { describe, expect, it } from "vitest";
import {
  calculateKaratToFinenessCoinGold,
  example,
  runKaratToFinenessCoinGold,
} from "./tool.js";

describe("numismatics/karat-to-fineness-coin-gold", () => {
  it("calculates the published example", () => {
    expect(calculateKaratToFinenessCoinGold(example.input)).toEqual(
      example.output,
    );
    expect(runKaratToFinenessCoinGold(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runKaratToFinenessCoinGold({
      ...example.input,
      karats: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
