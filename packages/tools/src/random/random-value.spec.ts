import { describe, expect, it } from "vitest";
import { selectRandomValue } from "./random-value.js";

describe("random value selection", () => {
  it("weights code-point ranges by their number of values", () => {
    const source = {
      ranges: [
        [0x41, 0x42],
        [0x50, 0x50],
      ],
    } as const;
    expect(selectRandomValue(source, () => 0)).toBe("A");
    expect(selectRandomValue(source, () => 0.5)).toBe("B");
    expect(selectRandomValue(source, () => 0.999)).toBe("P");
  });

  it("selects explicit values without splitting grapheme sequences", () => {
    const source = { values: ["alpha", "beta"] } as const;
    expect(selectRandomValue(source, () => 0.75)).toBe("beta");
  });

  it("rejects empty sets and invalid random samples", () => {
    expect(selectRandomValue({ values: [] }, () => 0)).toBeNull();
    expect(selectRandomValue({ ranges: [] }, () => 0)).toBeNull();
    expect(selectRandomValue({ values: ["A"] }, () => 1)).toBeNull();
  });
});
