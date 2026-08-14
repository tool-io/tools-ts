import { describe, expect, it } from "vitest";
import {
  calculateSeededRandomNumbers,
  createSeededRandom,
  runSeededNumber,
  seededNumberExample,
} from "./tool.js";

describe("Seeded Random Number Generator", () => {
  it("repeats a sequence for the same seed", () => {
    const first = createSeededRandom("same");
    const second = createSeededRandom("same");
    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });
  it("rejects blank seeds", () =>
    expect(calculateSeededRandomNumbers(" ", 2)).toBeNull());
  it.each([0, 1.5, 100_001])("rejects an invalid count of %s", (count) =>
    expect(calculateSeededRandomNumbers("seed", count)).toBeNull(),
  );
  it("publishes an executable example", () =>
    expect(runSeededNumber(seededNumberExample.input)).toEqual({
      ok: true,
      output: seededNumberExample.output,
    }));
});
