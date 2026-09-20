import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  palletPackingMeasurementDatasetExample as example,
  calculatePalletPackingMeasurementDataset,
} from "./tool.js";

describe("Random Pallet Packing Measurement Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePalletPackingMeasurementDataset(example.input)).toEqual({
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
  it("independently recomputes both grid orientations, layers, loaded height and mass", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const row of result.output.cases) {
      expect(row.error).toBeNull();
      if (!row.capacity || !row.height || !row.weight)
        throw new Error("Expected fitting case");
      const carton = row.carton,
        a =
          Math.floor(120 / carton.lengthCm) * Math.floor(100 / carton.widthCm),
        b =
          Math.floor(120 / carton.widthCm) * Math.floor(100 / carton.lengthCm);
      expect(row.capacity.tiCartonsPerLayer).toBe(Math.max(a, b));
      expect(row.capacity.hiLayers).toBe(Math.floor(180 / carton.heightCm));
      expect(row.height.totalStackHeightCm).toBe(
        15 + row.capacity.hiLayers * carton.heightCm,
      );
      expect(row.weight.totalGrossWeightKg).toBe(
        20 + row.capacity.totalCartonsPerPallet * (carton.weightGrams / 1000),
      );
    }
  });
  it("retains no-fit cases and output-capacity errors without a rejection sampler", () => {
    const result = tool.execute({
      ...example.input,
      cartonLength: { minimum: 1000, maximum: 1000 },
      count: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.cases).toHaveLength(2);
    for (const row of result.output.cases)
      expect(row).toMatchObject({
        capacity: null,
        height: null,
        weight: null,
        error: { code: "no_fit" },
      });
    const overflow = tool.execute({
      ...example.input,
      pallet: { ...example.input.pallet, lengthCm: Number.MAX_VALUE },
      count: 1,
    });
    expect(overflow).toMatchObject({
      ok: true,
      output: { cases: [{ error: { code: "capacity_out_of_range" } }] },
    });
  });
  it("rejects malformed ranges and dimensions before drawing", () => {
    for (const change of [
      { cartonLength: { minimum: 9, maximum: 8 } },
      { cartonWeightGrams: { minimum: 0, maximum: 1 } },
      { pallet: { ...example.input.pallet, lengthCm: 0 } },
      { count: 65 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
