import { describe, expect, it } from "vitest";
import { randomTimeExample, runRandomTime } from "./tool.js";
describe("random time", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomTime(randomTimeExample.input, { random: () => 0.5 }),
    ).toEqual({
      ok: true,
      output: {
        result: {
          hours: 12,
          minutes: 0,
          seconds: 0,
          secondsSinceMidnight: 43_200,
          text: "12:00",
        },
      },
    }));
});
