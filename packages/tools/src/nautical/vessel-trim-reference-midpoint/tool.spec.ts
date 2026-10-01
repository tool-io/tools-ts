import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("nautical/vessel-trim-reference-midpoint", () => {
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
        forwardDraft: 2,
        aftDraft: 5,
        forwardPosition: 10,
        aftPosition: 40,
        referencePosition: 20,
      }),
    ).toEqual({
      ok: true,
      output: { referenceDraft: 3, gradient: 0.1, midpointPosition: 25 },
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
    "rejects nonfinite forwardDraft",
    (value) =>
      expect(tool.execute({ ...example.input, forwardDraft: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite aftDraft", (value) =>
    expect(tool.execute({ ...example.input, aftDraft: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite forwardPosition",
    (value) =>
      expect(
        tool.execute({ ...example.input, forwardPosition: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite aftPosition",
    (value) =>
      expect(tool.execute({ ...example.input, aftPosition: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referencePosition",
    (value) =>
      expect(
        tool.execute({ ...example.input, referencePosition: value }).ok,
      ).toBe(false),
  );
  it.each([{ forwardDraft: -1 }, { aftDraft: -1 }])(
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
  it.each([{ forwardDraft: -1 }, { aftDraft: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});
