import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  toyPlanetarySystemExample as example,
  calculateToyPlanetarySystem,
} from "./tool.js";

describe("random/toy-planetary-system", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateToyPlanetarySystem(example.input),
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
    const requiredFields = [
      "count",
      "centralGravitationalParameter",
      "stellarRadiusMeters",
      "stellarTemperatureKelvin",
      "orbitalPeriodSeconds",
      "minimumPeriodGapSeconds",
      "bondAlbedo",
      "reradiationAreaFactor",
    ];
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
  it("independently retains near-AU scale, zero absorption, and ascending periods", () => {
    const r = tool.execute({
      ...example.input,
      count: 4,
      orbitalPeriodSeconds: { minimum: 1e7, maximum: 1e8 },
      bondAlbedo: { minimum: 1, maximum: 1 },
    });
    if (!r.ok) throw new Error("Expected system");
    for (const p of r.output.planets)
      expect(p.blackbodyEquilibriumKelvin).toBe(0);
    for (let i = 1; i < 4; i++) {
      expect(
        r.output.planets[i].orbitalPeriodSeconds -
          r.output.planets[i - 1].orbitalPeriodSeconds,
      ).toBeGreaterThanOrEqual(86400 * (1 - 1e-12));
      expect(r.output.planets[i].semiMajorAxisMeters).toBeGreaterThan(
        r.output.planets[i - 1].semiMajorAxisMeters,
      );
    }
    expect(example.output.planets[0].semiMajorAxisMeters).toBeGreaterThan(
      1.49e11,
    );
    expect(example.output.planets[0].semiMajorAxisMeters).toBeLessThan(1.5e11);
  });
  it("rejects infeasible spacing, interior orbits, and count limits", () => {
    expect(tool.execute({ ...example.input, count: 2 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "infeasible_period_spacing", field: "count" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        orbitalPeriodSeconds: { minimum: 100, maximum: 100 },
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "orbit_inside_star", field: "orbitalPeriodSeconds" }],
      },
    });
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
  });
});
