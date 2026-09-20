import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  stripPackingInstanceExample as example,
  calculateStripPackingInstance,
} from "./tool.js";
const smallInput = {
  rectangleCount: 2,
  stripWidth: 4,
  minimumWidth: 2,
  maximumWidth: 2,
  minimumHeight: 3,
  maximumHeight: 3,
  seed: 42,
} as const;

describe("Random Two-Dimensional Strip Packing Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateStripPackingInstance(example.input)).toEqual({
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
  it("checks bounds and pairwise non-overlap independently", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        rectangleCount: 30,
        stripWidth: 20,
        minimumWidth: 1,
        maximumWidth: 15,
        minimumHeight: 1,
        maximumHeight: 9,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.placements.map((p) => p.rectangle)).toEqual(
        Array.from({ length: 30 }, (_, i) => i),
      );
      for (let i = 0; i < out.placements.length; i += 1) {
        const a = out.placements[i],
          ar = out.rectangles[i];
        expect(a.x).toBeGreaterThanOrEqual(0);
        expect(a.x + ar.width).toBeLessThanOrEqual(20);
        expect(a.y + ar.height).toBeLessThanOrEqual(out.usedHeight);
        for (let j = 0; j < i; j += 1) {
          const b = out.placements[j],
            br = out.rectangles[j];
          expect(
            a.x + ar.width <= b.x ||
              b.x + br.width <= a.x ||
              a.y + ar.height <= b.y ||
              b.y + br.height <= a.y,
          ).toBe(true);
        }
      }
      expect(out.usedHeight).toBe(
        Math.max(
          ...out.placements.map((p, i) => p.y + out.rectangles[i].height),
        ),
      );
    }
  });
  it("guards width, exact height aggregates and range direction", () => {
    expect(tool.execute({ ...smallInput, maximumWidth: 5 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumWidth" }] },
    });
    expect(tool.execute({ ...smallInput, minimumHeight: 4 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumHeight" }] },
    });
    expect(
      tool.execute({
        ...smallInput,
        stripWidth: 2,
        minimumHeight: Number.MAX_SAFE_INTEGER,
        maximumHeight: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_aggregate" }] },
    });
  });
});
