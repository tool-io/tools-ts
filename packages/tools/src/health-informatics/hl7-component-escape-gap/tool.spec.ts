import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/hl7-component-escape-gap", () => {
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
        componentText: "A\\S",
        escapeCharacter: "\\",
        componentSeparator: "^",
      }),
    ).toEqual({
      ok: true,
      output: {
        unescapedSeparators: 0,
        completedEscapes: 0,
        unclosedEscape: true,
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
});

describe("independently reviewed regressions", () => {
  it("separators inside an escape-delimited span are not components", () => {
    const output = calculate({
      componentText: "A\\X^Y\\B^C",
      escapeCharacter: "\\",
      componentSeparator: "^",
    });
    expect(output).toMatchObject({
      unescapedSeparators: 1,
      completedEscapes: 1,
      unclosedEscape: false,
    });
    expect(
      tool.execute({
        componentText: "A\\X^Y\\B^C",
        escapeCharacter: "\\",
        componentSeparator: "^",
      }),
    ).toEqual({ ok: true, output });
  });
});
