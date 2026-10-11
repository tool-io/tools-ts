import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("sequence/geometric-sequence-reference-index-shift", () => {
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
        referenceTerm: 8,
        commonRatio: 2,
        referenceIndex: 4,
        targetIndex: 2,
      }),
    ).toEqual({ ok: true, output: { targetTerm: 2 } });
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
    "rejects nonfinite referenceTerm",
    (value) =>
      expect(tool.execute({ ...example.input, referenceTerm: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite commonRatio",
    (value) =>
      expect(tool.execute({ ...example.input, commonRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceIndex",
    (value) =>
      expect(tool.execute({ ...example.input, referenceIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetIndex",
    (value) =>
      expect(tool.execute({ ...example.input, targetIndex: value }).ok).toBe(
        false,
      ),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        referenceTerm: 3,
        commonRatio: 0,
        referenceIndex: 0,
        targetIndex: 0,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { targetTerm: 3 },
    });
    expect(calculate(input)).toEqual({ targetTerm: 3 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = {
      ...example.input,
      ...{ commonRatio: 0, referenceIndex: 1, targetIndex: 0 },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "commonRatio", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
