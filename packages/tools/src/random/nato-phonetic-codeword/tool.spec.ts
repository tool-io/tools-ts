import { describe, expect, it } from "vitest";
import {
  calculateRandomNatoPhoneticCodeword,
  randomNatoPhoneticCodewordExample,
  randomNatoPhoneticCodewordValueCount,
  runRandomNatoPhoneticCodeword,
} from "./tool.js";

describe("Random NATO Phonetic Codeword Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNatoPhoneticCodeword(randomNatoPhoneticCodewordExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "Alfa" } });
    expect(
      runRandomNatoPhoneticCodeword(randomNatoPhoneticCodewordExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "Zulu" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNatoPhoneticCodewordValueCount },
        (_, index) =>
          calculateRandomNatoPhoneticCodeword(
            () => (index + 0.5) / randomNatoPhoneticCodewordValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNatoPhoneticCodewordValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomNatoPhoneticCodeword({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
