import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/hl7-field-component-token", () => {
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
      tool.execute({ segmentCode: "OBX", fieldNumber: 5, componentNumber: 2 }),
    ).toEqual({ ok: true, output: { token: "OBX-5.2" } });
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
    "rejects nonfinite fieldNumber",
    (value) =>
      expect(tool.execute({ ...example.input, fieldNumber: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite componentNumber",
    (value) =>
      expect(
        tool.execute({ ...example.input, componentNumber: value }).ok,
      ).toBe(false),
  );
  it.each([{ fieldNumber: 0 }, { componentNumber: 0 }])(
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
  it.each([{ fieldNumber: 0 }, { componentNumber: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 77 reviewed regressions", () => {
  it("rejects a trailing newline in the segment identifier", () => {
    expect(
      tool.execute({ ...example.input, segmentCode: "PID\n" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "segmentCode", code: "invalid_domain" }] },
    });
  });
  it("reports a zero field number at the field input", () => {
    expect(tool.execute({ ...example.input, fieldNumber: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "fieldNumber", code: "invalid_field" }] },
    });
  });
});
