import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pathology/pathology-cassette-block-count-reconcile", () => {
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
        cassettes: 8,
        plannedBlocksPerCassette: 1,
        createdBlocks: 8,
        exhaustedBlocks: 2,
      }),
    ).toEqual({
      ok: true,
      output: { expectedBlocks: 8, missingBlocks: 0, remainingCreated: 6 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cassettes", (value) =>
    expect(tool.execute({ ...example.input, cassettes: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite plannedBlocksPerCassette",
    (value) =>
      expect(
        tool.execute({ ...example.input, plannedBlocksPerCassette: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite createdBlocks",
    (value) =>
      expect(tool.execute({ ...example.input, createdBlocks: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite exhaustedBlocks",
    (value) =>
      expect(
        tool.execute({ ...example.input, exhaustedBlocks: value }).ok,
      ).toBe(false),
  );
  it.each([
    { cassettes: -1 },
    { plannedBlocksPerCassette: 0 },
    { createdBlocks: -1 },
    { exhaustedBlocks: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { cassettes: -1 },
    { plannedBlocksPerCassette: 0 },
    { createdBlocks: -1 },
    { exhaustedBlocks: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
