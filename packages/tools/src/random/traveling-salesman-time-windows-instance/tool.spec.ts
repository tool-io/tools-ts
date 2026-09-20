import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  travelingSalesmanTimeWindowsInstanceExample as example,
  calculateTravelingSalesmanTimeWindowsInstance,
} from "./tool.js";
const smallInput = {
  cityCount: 2,
  minimumCoordinate: 0,
  maximumCoordinate: 0,
  serviceDuration: 2,
  windowSlack: 0,
  seed: 42,
} as const;

describe("Random Traveling Salesman With Time Windows Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(
      calculateTravelingSalesmanTimeWindowsInstance(example.input),
    ).toEqual({ ok: true, output: example.output });
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
  it("verifies travel rounding, service precedence and all inclusive time windows", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        cityCount: 9,
        minimumCoordinate: -10,
        maximumCoordinate: 10,
        windowSlack: 3,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(new Set(out.tour.slice(0, -1)).size).toBe(9);
      out.points.forEach((a, i) =>
        out.points.forEach((b, j) =>
          expect(out.travelTimes[i][j]).toBe(
            Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1])),
          ),
        ),
      );
      let expected = 0;
      out.tour.forEach((node, i) => {
        if (i > 0)
          expected +=
            out.serviceDurations[out.tour[i - 1]] +
            out.travelTimes[out.tour[i - 1]][node];
        expect(out.arrivalTimes[i]).toBe(expected);
        expect(expected).toBeGreaterThanOrEqual(out.timeWindows[node][0]);
        expect(expected).toBeLessThanOrEqual(out.timeWindows[node][1]);
      });
      expect(out.returnTime).toBe(expected);
      expect(out.serviceDurations[0]).toBe(0);
    }
  });
  it("rejects unsafe times or slack while retaining a zero-time feasible instance", () => {
    expect(
      tool.execute({
        ...smallInput,
        cityCount: 3,
        serviceDuration: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "serviceDuration" }] },
    });
    expect(
      tool.execute({ ...smallInput, windowSlack: Number.MAX_SAFE_INTEGER }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "windowSlack" }] },
    });
    const result = tool.execute({ ...smallInput, serviceDuration: 0 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.returnTime).toBe(0);
  });
});
