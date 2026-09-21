import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agroforestry/tree-row-root-zone-overlap-width", () => {
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
      tool.execute({ firstRadius: 2, secondRadius: 2, rowSpacing: 6 }),
    ).toEqual({ ok: true, output: { overlapWidth: 0, clearWidth: 2 } });
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
    "rejects nonfinite firstRadius",
    (value) =>
      expect(tool.execute({ ...example.input, firstRadius: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondRadius",
    (value) =>
      expect(tool.execute({ ...example.input, secondRadius: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rowSpacing", (value) =>
    expect(tool.execute({ ...example.input, rowSpacing: value }).ok).toBe(
      false,
    ),
  );
  it.each([{ firstRadius: -1 }, { secondRadius: -1 }, { rowSpacing: -1 }])(
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
  it.each([{ firstRadius: -1 }, { secondRadius: -1 }, { rowSpacing: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch 68 regression review

it("counts only the contained interval when radii differ", () => {
  expect(
    calculate({ firstRadius: 10, secondRadius: 1, rowSpacing: 1 }),
  ).toEqual({ overlapWidth: 2, clearWidth: 0 });
  expect(
    calculate({ firstRadius: 1, secondRadius: 10, rowSpacing: 1 }),
  ).toEqual({ overlapWidth: 2, clearWidth: 0 });
});
