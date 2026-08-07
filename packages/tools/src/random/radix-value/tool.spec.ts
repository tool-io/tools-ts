import { describe, expect, it } from "vitest";
import { randomRadixValueExample, runRandomRadixValue } from "./tool.js";
describe("random radix value", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomRadixValue(randomRadixValueExample.input, {
        random: () => 42 / 256,
      }),
    ).toEqual({
      ok: true,
      output: { result: { base: 16, decimal: 42, digits: "2A", text: "0x2A" } },
    }));
});
