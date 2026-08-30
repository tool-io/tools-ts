import { describe, expect, it } from "vitest";
import {
  calculateRandomKhudawadiCharacter,
  randomKhudawadiCharacterExample,
  randomKhudawadiCharacterValueCount,
  runRandomKhudawadiCharacter,
} from "./tool.js";

describe("Random Khudawadi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKhudawadiCharacter(randomKhudawadiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomKhudawadiCharacter(randomKhudawadiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑋹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKhudawadiCharacterValueCount },
        (_, index) =>
          calculateRandomKhudawadiCharacter(
            () => (index + 0.5) / randomKhudawadiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKhudawadiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKhudawadiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
