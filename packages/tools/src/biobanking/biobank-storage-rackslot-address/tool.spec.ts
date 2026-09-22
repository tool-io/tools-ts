import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biobanking/biobank-storage-rackslot-address", () => {
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
        rack: 0,
        box: 1,
        row: 2,
        column: 3,
        boxes: 3,
        rows: 4,
        columns: 5,
      }),
    ).toEqual({ ok: true, output: { index: 33 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rack", (value) =>
    expect(tool.execute({ ...example.input, rack: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite box", (value) =>
    expect(tool.execute({ ...example.input, box: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite row", (value) =>
    expect(tool.execute({ ...example.input, row: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite column", (value) =>
    expect(tool.execute({ ...example.input, column: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite boxes", (value) =>
    expect(tool.execute({ ...example.input, boxes: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rows", (value) =>
    expect(tool.execute({ ...example.input, rows: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite columns", (value) =>
    expect(tool.execute({ ...example.input, columns: value }).ok).toBe(false),
  );
  it.each([
    { rack: -1 },
    { box: -1 },
    { row: -1 },
    { column: -1 },
    { boxes: 0 },
    { rows: 0 },
    { columns: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { rack: -1 },
    { box: -1 },
    { row: -1 },
    { column: -1 },
    { boxes: 0 },
    { rows: 0 },
    { columns: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 68 regression review

it("rejects a flattened address beyond the portable safe-integer range", () => {
  const input = {
    rack: 9007199254740991,
    boxes: 2,
    box: 0,
    rows: 1,
    row: 0,
    columns: 1,
    column: 0,
  };
  expect(() => calculate(input)).toThrowError();
  expect(tool.execute(input)).toMatchObject({
    ok: false,
    error: { code: "invalid_input" },
  });
});
