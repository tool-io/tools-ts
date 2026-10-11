import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("radiology/dicom-pixel-spacing-pair", () => {
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
      tool.execute({ rowSpacingMillimeters: 1, columnSpacingMillimeters: 1 }),
    ).toEqual({
      ok: true,
      output: { dicomValue: "1\\1", pixelAreaSquareMillimeters: 1 },
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
    "rejects nonfinite rowSpacingMillimeters",
    (value) =>
      expect(
        tool.execute({ ...example.input, rowSpacingMillimeters: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite columnSpacingMillimeters",
    (value) =>
      expect(
        tool.execute({ ...example.input, columnSpacingMillimeters: value }).ok,
      ).toBe(false),
  );
  it.each([{ rowSpacingMillimeters: -1 }, { columnSpacingMillimeters: -1 }])(
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
  it.each([{ rowSpacingMillimeters: -1 }, { columnSpacingMillimeters: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 77 reviewed regressions", () => {
  it("preserves row-first order and permits a zero single-pixel spacing context", () => {
    expect(
      calculate({ rowSpacingMillimeters: 0, columnSpacingMillimeters: 0.8 }),
    ).toEqual({ dicomValue: "0\\0.8", pixelAreaSquareMillimeters: 0 });
  });
  it("rejects an unrounded decimal string exceeding DS length rather than rounding it", () => {
    expect(
      tool.execute({
        rowSpacingMillimeters: 0.12345678901234568,
        columnSpacingMillimeters: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "rowSpacingMillimeters", code: "invalid_domain" }],
      },
    });
  });
});
