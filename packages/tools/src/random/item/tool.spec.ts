import { describe, expect, it } from "vitest";
import { randomItemExample, runRandomItem } from "./tool.js";
describe("random item", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomItem(randomItemExample.input, { random: () => 0.5 }),
    ).toEqual({ ok: true, output: { value: "Sushi" } }));
});
