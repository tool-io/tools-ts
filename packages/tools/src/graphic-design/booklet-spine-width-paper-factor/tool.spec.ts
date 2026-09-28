import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("graphic-design/booklet-spine-width-paper-factor", () => {
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
        pages: 100,
        sheetsPerLeaf: 1,
        paperCaliper: 0.08,
        coverCaliper: 0.2,
        adhesiveAllowance: 0.2,
      }),
    ).toEqual({
      ok: true,
      output: {
        leafCount: 50,
        textThickness: 4,
        spineWidth: 4.6000000000000005,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pages", (value) =>
    expect(tool.execute({ ...example.input, pages: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sheetsPerLeaf",
    (value) =>
      expect(tool.execute({ ...example.input, sheetsPerLeaf: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite paperCaliper",
    (value) =>
      expect(tool.execute({ ...example.input, paperCaliper: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coverCaliper",
    (value) =>
      expect(tool.execute({ ...example.input, coverCaliper: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite adhesiveAllowance",
    (value) =>
      expect(
        tool.execute({ ...example.input, adhesiveAllowance: value }).ok,
      ).toBe(false),
  );
  it.each([
    { pages: -1 },
    { sheetsPerLeaf: 0 },
    { paperCaliper: -1 },
    { coverCaliper: -1 },
    { adhesiveAllowance: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { pages: -1 },
    { sheetsPerLeaf: 0 },
    { paperCaliper: -1 },
    { coverCaliper: -1 },
    { adhesiveAllowance: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
