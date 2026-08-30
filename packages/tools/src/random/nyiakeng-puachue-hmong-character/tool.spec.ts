import { describe, expect, it } from "vitest";
import {
  calculateRandomNyiakengPuachueHmongCharacter,
  randomNyiakengPuachueHmongCharacterExample,
  randomNyiakengPuachueHmongCharacterValueCount,
  runRandomNyiakengPuachueHmongCharacter,
} from "./tool.js";

describe("Random Nyiakeng Puachue Hmong Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNyiakengPuachueHmongCharacter(
        randomNyiakengPuachueHmongCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𞄀" } });
    expect(
      runRandomNyiakengPuachueHmongCharacter(
        randomNyiakengPuachueHmongCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𞅏" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNyiakengPuachueHmongCharacterValueCount },
        (_, index) =>
          calculateRandomNyiakengPuachueHmongCharacter(
            () => (index + 0.5) / randomNyiakengPuachueHmongCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNyiakengPuachueHmongCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomNyiakengPuachueHmongCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
