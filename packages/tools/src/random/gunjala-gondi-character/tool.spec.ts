import { describe, expect, it } from "vitest";
import {
  calculateRandomGunjalaGondiCharacter,
  randomGunjalaGondiCharacterExample,
  randomGunjalaGondiCharacterValueCount,
  runRandomGunjalaGondiCharacter,
} from "./tool.js";

describe("Random Gunjala Gondi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGunjalaGondiCharacter(randomGunjalaGondiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "·" } });
    expect(
      runRandomGunjalaGondiCharacter(randomGunjalaGondiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑶩" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGunjalaGondiCharacterValueCount },
        (_, index) =>
          calculateRandomGunjalaGondiCharacter(
            () => (index + 0.5) / randomGunjalaGondiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGunjalaGondiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomGunjalaGondiCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
