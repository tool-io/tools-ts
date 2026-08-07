import { describe, expect, it } from "vitest";
import { randomNumberExample, runRandomNumber } from "./tool.js";
describe("random number", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomNumber(randomNumberExample.input, { random: () => 0.5 }),
    ).toEqual({ ok: true, output: { value: 51 } }));
});
