import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("microbiology/microscope-grid-edge-share", () => {
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
      tool.execute({ rows: 3, columns: 4, includeCorners: false }),
    ).toEqual({
      ok: true,
      output: {
        totalCellsDecimal: "12",
        boundaryCellsDecimal: "6",
        share: 0.5,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rows", (value) =>
    expect(tool.execute({ ...example.input, rows: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite columns", (value) =>
    expect(tool.execute({ ...example.input, columns: value }).ok).toBe(false),
  );
  it.each([{ rows: 0 }, { columns: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ rows: 0 }, { columns: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("one-cell grid excludes its distinct corner once", () => {
    const output = calculate({ rows: 1, columns: 1, includeCorners: false });
    expect(output).toMatchObject({
      totalCellsDecimal: "1",
      boundaryCellsDecimal: "0",
      share: 0,
    });
    expect(
      tool.execute({ rows: 1, columns: 1, includeCorners: false }),
    ).toEqual({ ok: true, output });
  });
  it("single-row grid has two distinct corner cells", () => {
    const output = calculate({ rows: 1, columns: 5, includeCorners: false });
    expect(output).toMatchObject({
      totalCellsDecimal: "5",
      boundaryCellsDecimal: "3",
      share: 0.6,
    });
    expect(
      tool.execute({ rows: 1, columns: 5, includeCorners: false }),
    ).toEqual({ ok: true, output });
  });
});
