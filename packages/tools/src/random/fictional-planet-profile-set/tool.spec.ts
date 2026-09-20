import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  fictionalPlanetProfileSetExample as example,
  calculateFictionalPlanetProfileSet,
} from "./tool.js";

describe("random/fictional-planet-profile-set", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateFictionalPlanetProfileSet(example.input),
      tool.execute(example.input),
    ]) {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      expect(result.output).toEqual(example.output);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves input, replays seeds, and gives an explicit seed precedence", () => {
    const input = JSON.parse(JSON.stringify(example.input));
    const before = JSON.stringify(input);
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(JSON.stringify(input)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual(tool.execute(example.input));
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const result = tool.execute(unseeded, { random: () => 0.5 });
    if (!result.ok) throw new Error(JSON.stringify(result.error));
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("returns stable malformed-input and checked-source failures", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    expect(missing).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    if (missing.ok)
      throw new Error("Expected every required-field diagnostic.");
    const requiredFields = ["count", "massKg", "radiusMeters"];
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ field, code: "required_field" })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("independently preserves the radius scaling laws and zero-mass boundary", () => {
    const a = tool.execute({
        ...example.input,
        count: 1,
        massKg: { minimum: 6e24, maximum: 6e24 },
      }),
      b = tool.execute({
        ...example.input,
        count: 1,
        massKg: { minimum: 6e24, maximum: 6e24 },
        radiusMeters: { minimum: 12800000, maximum: 12800000 },
      });
    if (!a.ok || !b.ok) throw new Error("Expected planets");
    expect(
      a.output.planets[0].densityGramsPerCubicCentimeter /
        b.output.planets[0].densityGramsPerCubicCentimeter,
    ).toBe(8);
    expect(
      a.output.planets[0].surfaceGravityMetersPerSecondSquared /
        b.output.planets[0].surfaceGravityMetersPerSecondSquared,
    ).toBe(4);
    const z = tool.execute({
      ...example.input,
      massKg: { minimum: 0, maximum: 0 },
    });
    if (!z.ok) throw new Error("Expected zero mass");
    expect(
      z.output.planets.every(
        (p) =>
          p.densityGramsPerCubicCentimeter === 0 &&
          p.surfaceGravityMetersPerSecondSquared === 0,
      ),
    ).toBe(true);
  });
  it("rejects numerical conversion overflow and record excess", () => {
    expect(
      tool.execute({
        ...example.input,
        massKg: { minimum: 1e308, maximum: 1e308 },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_range", field: "massKg" }] },
    });
    expect(tool.execute({ ...example.input, count: 129 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
  });
});
