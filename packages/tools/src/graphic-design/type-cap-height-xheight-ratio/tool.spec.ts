import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("graphic-design/type-cap-height-xheight-ratio", () => {
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
        capHeight: 750,
        xHeight: 450,
        unitsPerEm: 1000,
        fontPixels: 16,
      }),
    ).toEqual({
      ok: true,
      output: { xCapRatio: 0.6, capPixels: 12, xPixels: 7.2 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite capHeight", (value) =>
    expect(tool.execute({ ...example.input, capHeight: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite xHeight", (value) =>
    expect(tool.execute({ ...example.input, xHeight: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite unitsPerEm", (value) =>
    expect(tool.execute({ ...example.input, unitsPerEm: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fontPixels", (value) =>
    expect(tool.execute({ ...example.input, fontPixels: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { capHeight: 0 },
    { xHeight: -1 },
    { unitsPerEm: 0 },
    { fontPixels: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { capHeight: 0 },
    { xHeight: -1 },
    { unitsPerEm: 0 },
    { fontPixels: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
