import { describe, expect, it } from "vitest";
import { randomHexColorExample, runRandomHexColor } from "./tool.js";
describe("random hex color", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomHexColor(randomHexColorExample.input, { random: () => 0.5 }),
    ).toEqual({ ok: true, output: { hex: "#800000" } }));
});
