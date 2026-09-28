import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/hl7-segment-field-number-offset", () => {
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
    expect(tool.execute({ segment: "MSH", fieldNumber: 1 })).toEqual({
      ok: true,
      output: { splitIndex: -1, separatorField: true },
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
    "rejects nonfinite fieldNumber",
    (value) =>
      expect(tool.execute({ ...example.input, fieldNumber: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ segment: "MSHxyz" }, { segment: "PID\n" }, { fieldNumber: 0 }])(
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
  it.each([{ segment: "MSHxyz" }, { segment: "PID\n" }, { fieldNumber: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 66 review regressions", () => {
  it("keeps MSH-1 virtual while ordinary segment fields retain their index", () => {
    expect(calculate({ segment: "MSH", fieldNumber: 1 })).toEqual({
      splitIndex: -1,
      separatorField: true,
    });
    expect(calculate({ segment: "PID", fieldNumber: 2 })).toEqual({
      splitIndex: 2,
      separatorField: false,
    });
  });
  it.each(["MSHsuffix", "PID\n"])(
    "rejects extra segment text with a segment issue: %j",
    (segment) => {
      expect(tool.execute({ segment, fieldNumber: 2 })).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "segment", code: "invalid_domain" }],
        },
      });
    },
  );
});
