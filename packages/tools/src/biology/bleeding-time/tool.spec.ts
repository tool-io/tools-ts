import { describe, expect, it } from "vitest";
import { bleedingTimeExample, runBleedingTime } from "./tool.js";

describe("Bleeding Time Category", () => {
  it("publishes an executable example", () =>
    expect(runBleedingTime(bleedingTimeExample.input)).toEqual({
      ok: true,
      output: bleedingTimeExample.output,
    }));
  it("classifies the upper normal boundary", () =>
    expect(runBleedingTime({ minutes: 7 })).toEqual({
      ok: true,
      output: { category: "normal" },
    }));
  it("classifies just above the normal boundary", () =>
    expect(runBleedingTime({ minutes: 7.5 })).toEqual({
      ok: true,
      output: { category: "borderline" },
    }));
  it("classifies the upper borderline boundary", () =>
    expect(runBleedingTime({ minutes: 15 })).toEqual({
      ok: true,
      output: { category: "borderline" },
    }));
  it("classifies a prolonged time", () =>
    expect(runBleedingTime({ minutes: 22 })).toEqual({
      ok: true,
      output: { category: "prolonged" },
    }));
  it("accepts zero minutes", () =>
    expect(runBleedingTime({ minutes: 0 })).toEqual({
      ok: true,
      output: { category: "normal" },
    }));
  it("rejects negative minutes", () => {
    const result = runBleedingTime({ minutes: -1 });
    expect(result.ok).toBe(false);
  });
  it("rejects minutes above thirty", () => {
    const result = runBleedingTime({ minutes: 30.5 });
    expect(result.ok).toBe(false);
  });
});
