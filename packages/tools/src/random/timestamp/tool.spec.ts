import { describe, expect, it } from "vitest";
import { randomTimestampExample, runRandomTimestamp } from "./tool.js";
describe("random timestamp", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomTimestamp(randomTimestampExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { timestamp: 1_767_225_600 } }));
});
