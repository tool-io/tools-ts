import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  depthLayeredStarfieldDatasetExample as example,
  calculateDepthLayeredStarfieldDataset,
} from "./tool.js";

describe("random/depth-layered-starfield-dataset", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateDepthLayeredStarfieldDataset(example.input),
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
      "layers",
      "xParsecs",
      "yParsecs",
      "absoluteMagnitude",
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
  it("independently retains the five-magnitude difference across tenfold distance", () => {
    const r = tool.execute({
      ...example.input,
      absoluteMagnitude: { minimum: 4, maximum: 4 },
    });
    if (!r.ok) throw new Error("Expected stars");
    expect(r.output.stars.map((s) => s.apparentMagnitude)).toEqual([4, 9]);
    expect(r.output.stars.map((s) => s.distanceModulus)).toEqual([0, 5]);
    expect(new Set(r.output.stars.map((s) => s.id)).size).toBe(2);
  });
  it("rejects layer overlap, duplicate identities, and combined output resources", () => {
    expect(
      tool.execute({
        ...example.input,
        layers: [
          {
            ...example.input.layers[0],
            depthParsecs: { minimum: 10, maximum: 200 },
          },
          example.input.layers[1],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "overlapping_depth_layers", field: "layers.1.depthParsecs" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        layers: [example.input.layers[0], example.input.layers[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "duplicate_entries", field: "layers" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        layers: Array.from({ length: 5 }, (_, i) => ({
          id: "layer" + i,
          count: 64,
          depthParsecs: { minimum: 10 + 10 * i, maximum: 20 + 10 * i },
        })),
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "star_resource_limit", field: "layers" }] },
    });
  });
});
