import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/hl7-delimiter-role-label", () => {
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
        character: "?",
        fieldSeparator: "|",
        encodingCharacters: "^~\\&",
      }),
    ).toEqual({ ok: true, output: { role: "unmapped", recognized: false } });
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

  it.each([{ encodingCharacters: "^^\\&" }, { encodingCharacters: "abc\t" }])(
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
  it.each([{ encodingCharacters: "^^\\&" }, { encodingCharacters: "abc\t" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("recognizes the v2.8 optional truncation delimiter", () => {
    const output = calculate({
      character: "#",
      fieldSeparator: "|",
      encodingCharacters: "^~\\&#",
    });
    expect(output).toMatchObject({ role: "truncation", recognized: true });
    expect(
      tool.execute({
        character: "#",
        fieldSeparator: "|",
        encodingCharacters: "^~\\&#",
      }),
    ).toEqual({ ok: true, output });
  });
  it("keeps the fourth encoding character as subcomponent", () => {
    const output = calculate({
      character: "&",
      fieldSeparator: "|",
      encodingCharacters: "^~\\&",
    });
    expect(output).toMatchObject({ role: "subcomponent", recognized: true });
    expect(
      tool.execute({
        character: "&",
        fieldSeparator: "|",
        encodingCharacters: "^~\\&",
      }),
    ).toEqual({ ok: true, output });
  });
  it("rejects a delimiter repeated across MSH fields", () => {
    expect(
      tool.execute({
        character: "^",
        fieldSeparator: "|",
        encodingCharacters: "^~\\|",
      }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "encodingCharacters" }],
      },
    });
    expect(() =>
      calculate({
        character: "^",
        fieldSeparator: "|",
        encodingCharacters: "^~\\|",
      }),
    ).toThrow();
  });
});
