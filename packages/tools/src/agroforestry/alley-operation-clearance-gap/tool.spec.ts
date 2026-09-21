import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agroforestry/alley-operation-clearance-gap", () => {
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
        rowSpacing: 10,
        leftCanopyRadius: 2,
        rightCanopyRadius: 3,
        implementWidth: 4,
        sideMargin: 1,
      }),
    ).toEqual({
      ok: true,
      output: { clearAlley: 5, totalRequiredWidth: 6, clearanceGap: -1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rowSpacing", (value) =>
    expect(tool.execute({ ...example.input, rowSpacing: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite leftCanopyRadius",
    (value) =>
      expect(
        tool.execute({ ...example.input, leftCanopyRadius: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rightCanopyRadius",
    (value) =>
      expect(
        tool.execute({ ...example.input, rightCanopyRadius: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite implementWidth",
    (value) =>
      expect(tool.execute({ ...example.input, implementWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sideMargin", (value) =>
    expect(tool.execute({ ...example.input, sideMargin: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { rowSpacing: -1 },
    { leftCanopyRadius: -1 },
    { rightCanopyRadius: -1 },
    { implementWidth: -1 },
    { sideMargin: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { rowSpacing: -1 },
    { leftCanopyRadius: -1 },
    { rightCanopyRadius: -1 },
    { implementWidth: -1 },
    { sideMargin: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
