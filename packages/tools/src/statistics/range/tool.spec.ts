import { describe, expect, it } from "vitest";
import { rangeExample, runRange } from "./tool.js";

describe("Range Calculator", () => {
  it("returns the endpoints and range", () =>
    expect(runRange({ values: [7, -2, 4] })).toEqual({
      ok: true,
      output: { maximum: 7, minimum: -2, range: 9 },
    }));

  it("rejects an empty list", () =>
    expect(runRange({ values: [] }).ok).toBe(false));

  it("publishes an executable example", () =>
    expect(runRange(rangeExample.input).ok).toBe(true));
});
