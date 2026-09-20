import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  vehicleRoutingInstanceExample as example,
  calculateVehicleRoutingInstance,
} from "./tool.js";
const smallInput = {
  customerCount: 1,
  vehicleCount: 2,
  vehicleCapacity: 2,
  minimumDemand: 2,
  maximumDemand: 2,
  minimumCoordinate: 0,
  maximumCoordinate: 0,
  seed: 42,
} as const;

describe("Random Capacitated Vehicle Routing Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateVehicleRoutingInstance(example.input)).toEqual({
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
  it("checks exact customer coverage, depot returns, capacities and measured route lengths", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        customerCount: 11,
        vehicleCount: 3,
        vehicleCapacity: 20,
        minimumDemand: 1,
        maximumDemand: 5,
        minimumCoordinate: -20,
        maximumCoordinate: 20,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(
        out.routes.flatMap((r) => r.slice(1, -1)).sort((a, b) => a - b),
      ).toEqual(Array.from({ length: 11 }, (_, i) => i + 1));
      out.routes.forEach((route, index) => {
        expect(route[0]).toBe(0);
        expect(route.at(-1)).toBe(0);
        expect(out.routeLoads[index]).toBe(
          route.reduce((s, n) => s + out.demands[n], 0),
        );
        expect(out.routeLoads[index]).toBeLessThanOrEqual(20);
        const length = route.slice(1).reduce((sum, n, i) => {
          const a = out.points[route[i]],
            b = out.points[n];
          return sum + Math.hypot(a[0] - b[0], a[1] - b[1]);
        }, 0);
        expect(out.routeLengths[index]).toBe(length);
      });
      expect(out.totalLength).toBe(out.routeLengths.reduce((s, n) => s + n, 0));
    }
  });
  it("states the construction feasibility rule and rejects invalid ranges", () => {
    expect(
      tool.execute({
        ...smallInput,
        customerCount: 5,
        vehicleCount: 2,
        vehicleCapacity: 5,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          {
            field: "vehicleCapacity",
            code: "insufficient_construction_capacity",
          },
        ],
      },
    });
    expect(tool.execute({ ...smallInput, minimumDemand: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumDemand" }] },
    });
    expect(tool.execute({ ...smallInput, minimumCoordinate: 1 })).toMatchObject(
      { ok: false, error: { issues: [{ field: "maximumCoordinate" }] } },
    );
  });
});
