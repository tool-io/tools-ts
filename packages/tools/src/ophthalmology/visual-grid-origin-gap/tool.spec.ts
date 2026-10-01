import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("ophthalmology/visual-grid-origin-gap", () => {
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
        row: 0,
        column: 0,
        firstOriginRow: 0,
        firstOriginColumn: 0,
        secondOriginRow: 0,
        secondOriginColumn: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        firstRelativeRowDecimal: "0",
        firstRelativeColumnDecimal: "0",
        secondRelativeRowDecimal: "0",
        secondRelativeColumnDecimal: "0",
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite row", (value) =>
    expect(tool.execute({ ...example.input, row: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite column", (value) =>
    expect(tool.execute({ ...example.input, column: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstOriginRow",
    (value) =>
      expect(tool.execute({ ...example.input, firstOriginRow: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstOriginColumn",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstOriginColumn: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondOriginRow",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondOriginRow: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondOriginColumn",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondOriginColumn: value }).ok,
      ).toBe(false),
  );
});
