import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  travelingSalesmanInstanceExample as example,
  calculateTravelingSalesmanInstance,
} from "./tool.js";
const smallInput = {
  cityCount: 2,
  minimumCoordinate: 0,
  maximumCoordinate: 0,
  seed: 42,
} as const;

describe("Random Euclidean Traveling Salesman Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateTravelingSalesmanInstance(example.input)).toEqual({
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
  it("independently checks Euclidean geometry, symmetry and the Hamiltonian tour", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        cityCount: 9,
        minimumCoordinate: -20,
        maximumCoordinate: 20,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.tour[0]).toBe(0);
      expect(out.tour.at(-1)).toBe(0);
      expect([...out.tour.slice(0, -1)].sort((a, b) => a - b)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
      ]);
      out.points.forEach((a, i) =>
        out.points.forEach((b, j) => {
          expect(
            a.every((x) => Number.isInteger(x) && x >= -20 && x <= 20),
          ).toBe(true);
          expect(out.distances[i][j]).toBe(
            Math.hypot(a[0] - b[0], a[1] - b[1]),
          );
          expect(out.distances[i][j]).toBe(out.distances[j][i]);
        }),
      );
      expect(out.tourLength).toBe(
        out.tour
          .slice(1)
          .reduce((sum, city, i) => sum + out.distances[out.tour[i]][city], 0),
      );
    }
  });
  it("rejects reversed or unsafe inclusive coordinate ranges", () => {
    expect(tool.execute({ ...smallInput, minimumCoordinate: 1 })).toMatchObject(
      { ok: false, error: { issues: [{ field: "maximumCoordinate" }] } },
    );
    expect(
      tool.execute({
        ...smallInput,
        minimumCoordinate: -Number.MAX_SAFE_INTEGER,
        maximumCoordinate: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({ ok: false });
  });
});
