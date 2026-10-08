import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("digital-humanities/digital-edition-anchor-fragment", () => {
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
    expect(tool.execute({ anchorId: "page😀" })).toEqual({
      ok: true,
      output: { fragment: "#page%F0%9F%98%80" },
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

  it.each([{ anchorId: "\ud800" }, { anchorId: "\udfff" }])(
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
  it.each([{ anchorId: "\ud800" }, { anchorId: "\udfff" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as Batch76DomainError } from "../../core/simple.js";
describe("batch 76 reviewed regressions", () => {
  it.each(["anchorId"])(
    "identifies an empty required text field %s",
    (field) => {
      expect(tool.execute({ ...example.input, [field]: "" })).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field, code: "invalid_field" }],
        },
      });
      expect(() => calculate({ ...example.input, [field]: "" })).toThrowError(
        Batch76DomainError,
      );
    },
  );
  it("encodes reserved URI characters without changing the anchor", () => {
    expect(calculate({ anchorId: "a/b#c?d" })).toEqual({
      fragment: "#a%2Fb%23c%3Fd",
    });
  });
  it.each(["\ud800", "\udfff"])(
    "rejects an unpaired UTF-16 surrogate %j",
    (anchorId) => {
      expect(tool.execute({ anchorId })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "anchorId", code: "invalid_domain" }] },
      });
    },
  );
});
