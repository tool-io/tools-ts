import { describe, expect, it } from "vitest";
import { randomOctalExample, runRandomOctal } from "./tool.js";
describe("random octal", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomOctal(randomOctalExample.input, { random: () => 42 / 512 }),
    ).toEqual({ ok: true, output: { value: "0o052" } }));
});
