import { describe, expect, it } from "vitest";
import { randomLetterExample, runRandomLetter } from "./tool.js";
describe("random letter", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomLetter(randomLetterExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { letter: "A" } }));
});
