import { describe, expect, it } from "vitest";
import {
  calculateRandomMeeteiMayekCharacter,
  randomMeeteiMayekCharacterExample,
  randomMeeteiMayekCharacterValueCount,
  runRandomMeeteiMayekCharacter,
} from "./tool.js";

describe("Random Meetei Mayek Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMeeteiMayekCharacter(randomMeeteiMayekCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꫠ" } });
    expect(
      runRandomMeeteiMayekCharacter(randomMeeteiMayekCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꯹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMeeteiMayekCharacterValueCount },
        (_, index) =>
          calculateRandomMeeteiMayekCharacter(
            () => (index + 0.5) / randomMeeteiMayekCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMeeteiMayekCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomMeeteiMayekCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
