import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("json/json-single-member-default-policy", () => {
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
        objectJson: "{}",
        memberName: "a",
        defaultScalarJson: "3",
        nullUsesDefault: false,
      }),
    ).toEqual({ ok: true, output: { selectedJson: "3", usedDefault: true } });
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

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        objectJson: '{"a":null}',
        memberName: "a",
        defaultScalarJson: "3",
        nullUsesDefault: true,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { selectedJson: "3", usedDefault: true },
    });
    expect(calculate(input)).toEqual({ selectedJson: "3", usedDefault: true });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        objectJson: '{"__proto__":false}',
        memberName: "__proto__",
        defaultScalarJson: "3",
        nullUsesDefault: false,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { selectedJson: "false", usedDefault: false },
    });
    expect(calculate(input)).toEqual({
      selectedJson: "false",
      usedDefault: false,
    });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ objectJson: '{"a":1e400}' } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "objectJson", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ defaultScalarJson: "[]" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "defaultScalarJson", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
