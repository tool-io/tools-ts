import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("information-science/vocabulary-concept-branch-depth", () => {
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
        parentIds: ["A", "B"],
        childIds: ["B", "A"],
        concept: "A",
      }),
    ).toEqual({
      ok: true,
      output: { ancestorCount: 1, maximumDepth: -1, cyclic: true },
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

  it.each([{ parentIds: [] }])(
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
  it.each([{ parentIds: [] }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("polyhierarchy counts unique ancestors but longest depth", () => {
    const output = calculate({
      parentIds: ["A", "A", "B", "C"],
      childIds: ["B", "C", "D", "D"],
      concept: "D",
    });
    expect(output).toMatchObject({
      ancestorCount: 3,
      maximumDepth: 2,
      cyclic: false,
    });
    expect(
      tool.execute({
        parentIds: ["A", "A", "B", "C"],
        childIds: ["B", "C", "D", "D"],
        concept: "D",
      }),
    ).toEqual({ ok: true, output });
  });
  it("self-parent cycles are explicitly flagged", () => {
    const output = calculate({
      parentIds: ["A"],
      childIds: ["A"],
      concept: "A",
    });
    expect(output).toMatchObject({
      ancestorCount: 0,
      maximumDepth: -1,
      cyclic: true,
    });
    expect(
      tool.execute({ parentIds: ["A"], childIds: ["A"], concept: "A" }),
    ).toEqual({ ok: true, output });
  });
});
