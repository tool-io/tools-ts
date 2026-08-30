import { describe, expect, it } from "vitest";
import {
  calculateRandomMaritimeSignalFlag,
  randomMaritimeSignalFlagExample,
  randomMaritimeSignalFlagValueCount,
  runRandomMaritimeSignalFlag,
} from "./tool.js";

describe("Random Maritime Signal Flag Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMaritimeSignalFlag(randomMaritimeSignalFlagExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "A — Alfa" } });
    expect(
      runRandomMaritimeSignalFlag(randomMaritimeSignalFlagExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "Answering pennant" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMaritimeSignalFlagValueCount },
        (_, index) =>
          calculateRandomMaritimeSignalFlag(
            () => (index + 0.5) / randomMaritimeSignalFlagValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMaritimeSignalFlagValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMaritimeSignalFlag({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
