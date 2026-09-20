import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cssClipPathShapeExample as example,
  calculateCssClipPathShape,
} from "./tool.js";

describe("random/css-clip-path-shape", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateCssClipPathShape(example.input),
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
      "vertexCount",
      "radiusPercent",
      "areaPercentSquared",
      "maximumAttempts",
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
  it("has an independent perpendicular-diagonal area and simple bounds", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected polygon");
    expect(result.output.areaPercentSquared).toBe((69 * 63) / 2);
    for (let seed = 0; seed < 16; seed++) {
      const r = tool.execute({ ...example.input, vertexCount: 9, seed });
      if (!r.ok) throw new Error("Expected polygon");
      expect(r.output.vertices).toHaveLength(9);
      for (const p of r.output.vertices) {
        expect(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100).toBe(true);
      }
    }
  });
  it("reports a bounded unsuccessful search and invalid vertex resources", () => {
    expect(
      tool.execute({
        ...example.input,
        areaPercentSquared: { minimum: 10000, maximum: 10000 },
        maximumAttempts: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "search_exhausted", field: "maximumAttempts" }],
      },
    });
    expect(tool.execute({ ...example.input, vertexCount: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "vertexCount" }] },
    });
  });
});
