import { describe, expect, it } from "vitest";
import {
  calculateRandomPhoenicianLetter,
  randomPhoenicianLetterExample,
  randomPhoenicianLetterValueCount,
  runRandomPhoenicianLetter,
} from "./tool.js";

describe("Random Phoenician Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPhoenicianLetter(randomPhoenicianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐤀" } });
    expect(
      runRandomPhoenicianLetter(randomPhoenicianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐤕" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPhoenicianLetterValueCount },
        (_, index) =>
          calculateRandomPhoenicianLetter(
            () => (index + 0.5) / randomPhoenicianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPhoenicianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomPhoenicianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
