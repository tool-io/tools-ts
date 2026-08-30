import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, flexGrowSpaceDistributionInputSchema, flexGrowSpaceDistributionOutputSchema } from "./index.js";
describe("css/flex-grow-space-distribution", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, flexGrowSpaceDistributionInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, flexGrowSpaceDistributionOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "freeSpace": 100,
      "growFactors": [
        0.25,
        0.25
      ]
    })).toEqual({ ok: true, output: {
      "allocations": [
        25,
        25
      ],
      "unallocatedSpace": 50
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "freeSpace": 100,
      "growFactors": []
    })).toEqual({ ok: true, output: {
      "allocations": [],
      "unallocatedSpace": 100
    } });
    expect(tool.execute({
      "freeSpace": 100,
      "growFactors": [
        0,
        0
      ]
    })).toEqual({ ok: true, output: {
      "allocations": [
        0,
        0
      ],
      "unallocatedSpace": 100
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "freeSpace", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, freeSpace: Infinity })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "freeSpace", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, growFactors: [-1] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "growFactors.0", code: "out_of_range" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["freeSpace", "growFactors"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["freeSpace"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("normalizes very large factors without overflowing their sum", () => {
    expect(tool.execute({ freeSpace: 120, growFactors: [1e308, 1e308] })).toEqual({ ok: true, output: { allocations: [60, 60], unallocatedSpace: 0 } });
    expect(tool.execute({ freeSpace: 100, growFactors: [0.1, 0.2] })).toMatchObject({ ok: true });
  });
});
