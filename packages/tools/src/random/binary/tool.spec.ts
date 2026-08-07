import { describe, expect, it } from "vitest";
import { randomBinaryExample, runRandomBinary } from "./tool.js";
describe("random binary", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomBinary(randomBinaryExample.input, { random: () => 42 / 256 }),
    ).toEqual({ ok: true, output: { value: "0b00101010" } }));
});
