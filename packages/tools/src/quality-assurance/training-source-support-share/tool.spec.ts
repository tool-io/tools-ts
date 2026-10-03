import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("quality-assurance/training-source-support-share", () => {
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
        personIds: [],
        courseIds: [],
        requiredVersions: [],
        acknowledgedVersions: [],
        sourceVerified: [],
      }),
    ).toEqual({
      ok: true,
      output: { requiredPairs: 0, supportedPairs: 0, share: 0, defined: false },
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
});

describe("independently reviewed regressions", () => {
  it("duplicate acknowledgements do not inflate person-course coverage", () => {
    const output = calculate({
      personIds: ["p1", "p1"],
      courseIds: ["a", "a"],
      requiredVersions: ["v2", "v2"],
      acknowledgedVersions: ["v2", "v2"],
      sourceVerified: [true, true],
    });
    expect(output).toMatchObject({
      requiredPairs: 1,
      supportedPairs: 1,
      share: 1,
      defined: true,
    });
    expect(
      tool.execute({
        personIds: ["p1", "p1"],
        courseIds: ["a", "a"],
        requiredVersions: ["v2", "v2"],
        acknowledgedVersions: ["v2", "v2"],
        sourceVerified: [true, true],
      }),
    ).toEqual({ ok: true, output });
  });
});
