import { describe, expect, it } from "vitest";
import {
  calculatePonderalIndex,
  ponderalIndexExample,
  runPonderalIndex,
} from "./tool.js";
describe("ponderal index", () => {
  it("publishes an executable example", () =>
    expect(runPonderalIndex(ponderalIndexExample.input)).toEqual({
      ok: true,
      output: ponderalIndexExample.output,
    }));

  it("rejects non-finite and non-positive measurements", () => {
    expect(calculatePonderalIndex("adult", "metric", Infinity, 180)).toBeNull();
    expect(calculatePonderalIndex("newborn", "us", 7, 0)).toBeNull();
  });
});
