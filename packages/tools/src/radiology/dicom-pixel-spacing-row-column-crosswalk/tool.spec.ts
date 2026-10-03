import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("radiology/dicom-pixel-spacing-row-column-crosswalk", () => {
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
      tool.execute({ rowOffset: 1, columnOffset: 2, pixelSpacing: [0.5, 0.5] }),
    ).toEqual({
      ok: true,
      output: {
        rowDistanceMm: 0.5,
        columnDistanceMm: 1,
        planarDistanceMm: 1.118033988749895,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rowOffset", (value) =>
    expect(tool.execute({ ...example.input, rowOffset: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite columnOffset",
    (value) =>
      expect(tool.execute({ ...example.input, columnOffset: value }).ok).toBe(
        false,
      ),
  );
});

describe("batch 66 review regressions", () => {
  it("keeps row spacing first when the two spacings differ", () => {
    expect(
      calculate({ rowOffset: 3, columnOffset: 4, pixelSpacing: [2, 3] }),
    ).toEqual({
      rowDistanceMm: 6,
      columnDistanceMm: 12,
      planarDistanceMm: 13.416407864998739,
    });
  });
});
