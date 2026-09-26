import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("epidemiology/case-definition-component-flag", () => {
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
        componentSatisfied: [true, false],
        componentKnown: [true, false],
        requireAll: false,
      }),
    ).toEqual({ ok: true, output: { definitionKnown: true, meetsRule: true } });
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

  it.each([{ componentKnown: [] }])(
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
  it.each([{ componentKnown: [] }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 71 independent regressions", () => {
  it("a known false conjunct resolves an unknown conjunction", () => {
    expect(
      calculate({
        componentSatisfied: [false, true],
        componentKnown: [true, false],
        requireAll: true,
      }),
    ).toEqual({ definitionKnown: true, meetsRule: false });
    expect(
      tool.execute({
        componentSatisfied: [false, true],
        componentKnown: [true, false],
        requireAll: true,
      }),
    ).toEqual({
      ok: true,
      output: { definitionKnown: true, meetsRule: false },
    });
  });
  it("a false disjunct leaves an unknown disjunction unresolved", () => {
    expect(
      calculate({
        componentSatisfied: [false, true],
        componentKnown: [true, false],
        requireAll: false,
      }),
    ).toEqual({ definitionKnown: false, meetsRule: false });
    expect(
      tool.execute({
        componentSatisfied: [false, true],
        componentKnown: [true, false],
        requireAll: false,
      }),
    ).toEqual({
      ok: true,
      output: { definitionKnown: false, meetsRule: false },
    });
  });
  it("keeps an entirely unknown classification unresolved", () => {
    expect(
      calculate({
        componentSatisfied: [true, true],
        componentKnown: [false, false],
        requireAll: false,
      }),
    ).toEqual({ definitionKnown: false, meetsRule: false });
    expect(
      tool.execute({
        componentSatisfied: [true, true],
        componentKnown: [false, false],
        requireAll: false,
      }),
    ).toEqual({
      ok: true,
      output: { definitionKnown: false, meetsRule: false },
    });
  });
});
