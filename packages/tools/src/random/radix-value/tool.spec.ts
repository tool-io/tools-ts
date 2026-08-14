import { describe, expect, it } from "vitest";
import {
  calculateRandomRadixValue,
  randomRadixValueExample,
  runRandomRadixValue,
  type SupportedRadix,
} from "./tool.js";
describe("random radix value", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomRadixValue(randomRadixValueExample.input, {
        random: () => 42 / 256,
      }),
    ).toEqual({
      ok: true,
      output: {
        result: {
          base: 16,
          decimal: 42,
          digits: "2A",
          prefixed: "0x2A",
          text: "0x2A",
        },
      },
    }));

  it("rejects unsupported bases and invalid widths", () => {
    expect(
      calculateRandomRadixValue(0, 10, 2, 10 as SupportedRadix, true),
    ).toBeNull();
    expect(calculateRandomRadixValue(0, 10, 1.5, 2, true)).toBeNull();
  });
});
