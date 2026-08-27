import { describe, expect, it } from "vitest";
import { punnettSquareDiExample, runPunnettSquareDi } from "./tool.js";

describe("Dihybrid Ratio", () => {
  it("matches the canonical example", () => {
    const result = runPunnettSquareDi(punnettSquareDiExample.input);
    expect(result).toEqual({ ok: true, output: punnettSquareDiExample.output });
  });
  it("reports nine sixteenths for both dominant traits", () =>
    expect(runPunnettSquareDi({ cross: "aabb-cross" })).toMatchObject({
      ok: true,
      output: { bothDominant: 0.5625 },
    }));
  it("reports three eighths for exactly one dominant trait", () =>
    expect(runPunnettSquareDi({ cross: "aabb-cross" })).toMatchObject({
      ok: true,
      output: { singleDominant: 0.375 },
    }));
  it("reports one sixteenth for both recessive traits", () =>
    expect(runPunnettSquareDi({ cross: "aabb-cross" })).toMatchObject({
      ok: true,
      output: { bothRecessive: 0.0625 },
    }));
  it("fractions sum to one", () => {
    const result = runPunnettSquareDi({ cross: "aabb-cross" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        Number(result.output.bothDominant) +
          Number(result.output.singleDominant) +
          Number(result.output.bothRecessive),
      ).toBeCloseTo(1, 12);
  });
  it("rejects unsupported cross types", () =>
    expect(runPunnettSquareDi({ cross: "AABB-cross" as "aabb-cross" }).ok).toBe(
      false,
    ));
});
