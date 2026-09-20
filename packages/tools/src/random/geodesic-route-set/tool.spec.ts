import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  geodesicRouteSetExample as example,
  calculateGeodesicRouteSet,
} from "./tool.js";

describe("Random Geodesic Route Set Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateGeodesicRouteSet(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("supports all hemispheres and independently checks short-arc endpoint distances", () => {
    for (const start of [
      { latitudeDeg: -35, longitudeDeg: -120 },
      { latitudeDeg: 35, longitudeDeg: -120 },
      { latitudeDeg: -35, longitudeDeg: 120 },
      { latitudeDeg: 35, longitudeDeg: 120 },
    ]) {
      const result = tool.execute({
        ...example.input,
        start,
        routeCount: 2,
        legCount: 10,
        minimumLegKm: 100,
        maximumLegKm: 2000,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const route of result.output.routes) {
        expect(route.legs[0].from).toEqual(start);
        route.legs.forEach((leg, i) => {
          if (i) expect(leg.from).toEqual(route.legs[i - 1].to);
          const rad = (value: number) => (value * Math.PI) / 180,
            a =
              Math.sin(rad(leg.to.latitudeDeg - leg.from.latitudeDeg) / 2) **
                2 +
              Math.cos(rad(leg.from.latitudeDeg)) *
                Math.cos(rad(leg.to.latitudeDeg)) *
                Math.sin(
                  rad(leg.to.longitudeDeg - leg.from.longitudeDeg) / 2,
                ) **
                  2;
          expect(leg.endpointKilometers).toBeCloseTo(
            6371.0088 * 2 * Math.asin(Math.min(1, Math.sqrt(a))),
            1,
          );
          expect(
            Math.abs(leg.endpointKilometers - leg.requestedKilometers),
          ).toBeLessThan(2);
          expect(leg.to.latitudeDeg).toBeGreaterThanOrEqual(-90);
          expect(leg.to.latitudeDeg).toBeLessThanOrEqual(90);
          expect(leg.to.longitudeDeg).toBeGreaterThanOrEqual(-180);
          expect(leg.to.longitudeDeg).toBeLessThanOrEqual(180);
        });
        expect(route.totalEndpointKilometers).toBeCloseTo(
          route.legs.reduce((sum, leg) => sum + leg.endpointKilometers, 0),
          8,
        );
      }
    }
  });
  it("distinguishes commanded long arcs from short-arc endpoint separation and allows rounding to zero displacement", () => {
    const result = tool.execute({
      ...example.input,
      minimumLegKm: 30000,
      maximumLegKm: 30000,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.routes[0].legs.every(
          (leg) => leg.endpointKilometers < 15000,
        ),
      ).toBe(true);
    expect(
      tool.execute({
        ...example.input,
        minimumLegKm: Number.MIN_VALUE,
        maximumLegKm: Number.MIN_VALUE,
      }),
    ).toMatchObject({
      ok: true,
      output: { routes: [{ totalEndpointKilometers: 0 }] },
    });
  });
  it("rejects invalid coordinates, unsupported destination-core ranges, and excessive counts", () => {
    for (const change of [
      { start: { latitudeDeg: -91, longitudeDeg: 0 } },
      { minimumLegKm: 0 },
      { maximumLegKm: 40076 },
      { minimumLegKm: 2000 },
      { routeCount: 17 },
      { legCount: 33 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
