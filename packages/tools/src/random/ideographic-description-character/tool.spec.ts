import { describe, expect, it } from "vitest";
import {
  calculateRandomIdeographicDescriptionCharacter,
  randomIdeographicDescriptionCharacterExample,
  randomIdeographicDescriptionCharacterValueCount,
  runRandomIdeographicDescriptionCharacter,
} from "./tool.js";

describe("Random Ideographic Description Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomIdeographicDescriptionCharacter(
        randomIdeographicDescriptionCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "⿰" } });
    expect(
      runRandomIdeographicDescriptionCharacter(
        randomIdeographicDescriptionCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "㇯" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomIdeographicDescriptionCharacterValueCount },
        (_, index) =>
          calculateRandomIdeographicDescriptionCharacter(
            () =>
              (index + 0.5) / randomIdeographicDescriptionCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomIdeographicDescriptionCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomIdeographicDescriptionCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
