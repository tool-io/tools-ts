import { describe, expect, it } from "vitest";
import { randomHexadecimalExample, runRandomHexadecimal } from "./tool.js";
describe("random hexadecimal", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomHexadecimal(randomHexadecimalExample.input, {
        random: () => 0.5,
      }),
    ).toEqual({ ok: true, output: { value: "0x8000" } }));
});
