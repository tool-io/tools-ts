import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("immunology/elispot-background-percell-count-term", () => {
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
        stimulatedSpots: 20,
        blankSpots: 5,
        stimulatedCells: 100000,
        blankCells: 100000,
        reportCellBase: 1000000,
      }),
    ).toEqual({
      ok: true,
      output: { scaledBackground: 5, correctedSpots: 15, perCellBase: 150 },
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
    "rejects nonfinite stimulatedSpots",
    (value) =>
      expect(
        tool.execute({ ...example.input, stimulatedSpots: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite blankSpots", (value) =>
    expect(tool.execute({ ...example.input, blankSpots: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite stimulatedCells",
    (value) =>
      expect(
        tool.execute({ ...example.input, stimulatedCells: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite blankCells", (value) =>
    expect(tool.execute({ ...example.input, blankCells: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reportCellBase",
    (value) =>
      expect(tool.execute({ ...example.input, reportCellBase: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { stimulatedSpots: -1 },
    { blankSpots: -1 },
    { stimulatedCells: 0 },
    { blankCells: 0 },
    { reportCellBase: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { stimulatedSpots: -1 },
    { blankSpots: -1 },
    { stimulatedCells: 0 },
    { blankCells: 0 },
    { reportCellBase: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
