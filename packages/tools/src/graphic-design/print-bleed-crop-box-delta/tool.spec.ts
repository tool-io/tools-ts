import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("graphic-design/print-bleed-crop-box-delta", () => {
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
        trimWidth: 80,
        trimHeight: 40,
        bleedLeft: 0,
        bleedRight: 2,
        bleedTop: 1,
        bleedBottom: 0,
      }),
    ).toEqual({ ok: true, output: { bleedWidth: 82, bleedHeight: 41 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite trimWidth", (value) =>
    expect(tool.execute({ ...example.input, trimWidth: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite trimHeight", (value) =>
    expect(tool.execute({ ...example.input, trimHeight: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite bleedLeft", (value) =>
    expect(tool.execute({ ...example.input, bleedLeft: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite bleedRight", (value) =>
    expect(tool.execute({ ...example.input, bleedRight: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite bleedTop", (value) =>
    expect(tool.execute({ ...example.input, bleedTop: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite bleedBottom",
    (value) =>
      expect(tool.execute({ ...example.input, bleedBottom: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { trimWidth: -1 },
    { trimHeight: -1 },
    { bleedLeft: -1 },
    { bleedRight: -1 },
    { bleedTop: -1 },
    { bleedBottom: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { trimWidth: -1 },
    { trimHeight: -1 },
    { bleedLeft: -1 },
    { bleedRight: -1 },
    { bleedTop: -1 },
    { bleedBottom: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
