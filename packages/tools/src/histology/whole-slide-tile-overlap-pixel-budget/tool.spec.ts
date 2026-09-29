import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("histology/whole-slide-tile-overlap-pixel-budget", () => {
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
      tool.execute({
        tileWidth: 50,
        tileHeight: 50,
        columns: 2,
        rows: 2,
        overlapX: 0,
        overlapY: 0,
      }),
    ).toEqual({
      ok: true,
      output: { mosaicWidth: 100, mosaicHeight: 100, pixelsSaved: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tileWidth", (value) =>
    expect(tool.execute({ ...example.input, tileWidth: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tileHeight", (value) =>
    expect(tool.execute({ ...example.input, tileHeight: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite columns", (value) =>
    expect(tool.execute({ ...example.input, columns: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rows", (value) =>
    expect(tool.execute({ ...example.input, rows: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite overlapX", (value) =>
    expect(tool.execute({ ...example.input, overlapX: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite overlapY", (value) =>
    expect(tool.execute({ ...example.input, overlapY: value }).ok).toBe(false),
  );
  it.each([
    { tileWidth: 0 },
    { tileHeight: 0 },
    { columns: 0 },
    { rows: 0 },
    { overlapX: -1 },
    { overlapY: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { tileWidth: 0 },
    { tileHeight: 0 },
    { columns: 0 },
    { rows: 0 },
    { overlapX: -1 },
    { overlapY: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
