import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-physics/periodic-ghost-cell-index", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({ storageIndex: 3, interiorCellCount: 4, ghostLayers: 1 }),
    ).toEqual({
      ok: true,
      output: { interiorSourceIndex: 2, ghostCell: false },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite storageIndex",
    (value) =>
      expect(tool.execute({ ...example.input, storageIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite interiorCellCount",
    (value) =>
      expect(
        tool.execute({ ...example.input, interiorCellCount: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ghostLayers",
    (value) =>
      expect(tool.execute({ ...example.input, ghostLayers: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { storageIndex: -1 },
    { interiorCellCount: 0 },
    { ghostLayers: -1 },
    { ghostLayers: 4503599627370496 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { storageIndex: -1 },
    { interiorCellCount: 0 },
    { ghostLayers: -1 },
    { ghostLayers: 4503599627370496 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 76 reviewed regressions", () => {
  it("wraps the first right ghost into the first interior cell", () => {
    expect(
      calculate({ storageIndex: 5, interiorCellCount: 4, ghostLayers: 1 }),
    ).toEqual({ interiorSourceIndex: 0, ghostCell: true });
  });
  it("accepts a large padding count without an arbitrary million-cell bound", () => {
    expect(
      calculate({
        storageIndex: 0,
        interiorCellCount: 4,
        ghostLayers: 1000001,
      }),
    ).toEqual({ interiorSourceIndex: 3, ghostCell: true });
  });
  it("rejects a padded count beyond exact integer arithmetic", () => {
    expect(
      tool.execute({
        storageIndex: 0,
        interiorCellCount: 3,
        ghostLayers: 4503599627370495,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "ghostLayers", code: "invalid_domain" }] },
    });
  });
});
