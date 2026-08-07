import { describe, expect, it } from "vitest";
import { randomDateExample, runRandomDate } from "./tool.js";
describe("random date", () => {
  it("uses injected randomness", () =>
    expect(runRandomDate(randomDateExample.input, { random: () => 0 })).toEqual(
      { ok: true, output: { date: "2026-01-01" } },
    ));
});
