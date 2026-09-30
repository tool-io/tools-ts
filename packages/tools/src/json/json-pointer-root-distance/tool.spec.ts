import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("json/json-pointer-root-distance", () => {
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
    expect(tool.execute({ pointer: "" })).toEqual({
      ok: true,
      output: { segments: 0 },
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
  it("an empty reference token is one traversal", () => {
    const output = calculate({ pointer: "/" });
    expect(output).toMatchObject({ segments: 1 });
    expect(tool.execute({ pointer: "/" })).toEqual({ ok: true, output });
  });
  it("an escaped slash remains inside one token", () => {
    const output = calculate({ pointer: "/a~1b" });
    expect(output).toMatchObject({ segments: 1 });
    expect(tool.execute({ pointer: "/a~1b" })).toEqual({ ok: true, output });
  });
  it("invalid tilde escapes are not silently accepted", () => {
    expect(tool.execute({ pointer: "/a~2b" })).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "" }],
      },
    });
    expect(() => calculate({ pointer: "/a~2b" })).toThrow();
  });
});
