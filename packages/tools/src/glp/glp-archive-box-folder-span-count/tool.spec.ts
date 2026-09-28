import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("glp/glp-archive-box-folder-span-count", () => {
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
        firstBox: 2,
        lastBox: 2,
        foldersPerBox: 8,
        firstFolder: 3,
        lastFolder: 5,
      }),
    ).toEqual({ ok: true, output: { folderCount: 3, boxSpan: 1 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstBox", (value) =>
    expect(tool.execute({ ...example.input, firstBox: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lastBox", (value) =>
    expect(tool.execute({ ...example.input, lastBox: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite foldersPerBox",
    (value) =>
      expect(tool.execute({ ...example.input, foldersPerBox: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstFolder",
    (value) =>
      expect(tool.execute({ ...example.input, firstFolder: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lastFolder", (value) =>
    expect(tool.execute({ ...example.input, lastFolder: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { firstBox: -1 },
    { foldersPerBox: 0 },
    { firstFolder: 0 },
    { lastFolder: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstBox: -1 },
    { foldersPerBox: 0 },
    { firstFolder: 0 },
    { lastFolder: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 67 review regressions", () => {
  it("counts across a box boundary exactly near the safe-integer limit", () => {
    expect(
      calculate({
        firstBox: 0,
        lastBox: 1,
        foldersPerBox: Number.MAX_SAFE_INTEGER,
        firstFolder: Number.MAX_SAFE_INTEGER,
        lastFolder: 2,
      }),
    ).toEqual({ folderCount: 3, boxSpan: 2 });
  });
});
