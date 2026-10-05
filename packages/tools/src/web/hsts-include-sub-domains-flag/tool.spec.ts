import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("web/hsts-include-sub-domains-flag", () => {
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
    expect(tool.execute({ headerValue: "max-age=0" })).toEqual({
      ok: true,
      output: { includeSubDomains: false },
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

  it.each([{ headerValue: "max-age=1\r\nInjected:x" }])(
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
  it.each([{ headerValue: "max-age=1\r\nInjected:x" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch75 review regressions
it("ignores flag-shaped text inside quoted extension values", () => {
  expect(
    calculate({
      headerValue: 'max-age=30; note="; includeSubDomains;"; x=yes',
    }),
  ).toEqual({ includeSubDomains: false });
  expect(
    calculate({ headerValue: 'max-age=30; note="a\\";includeSubDomains;b"' }),
  ).toEqual({ includeSubDomains: false });
  expect(
    calculate({
      headerValue: 'max-age=30; note="includeSubDomains"; includeSubDomains',
    }),
  ).toEqual({ includeSubDomains: true });
  expect(
    tool.execute({ headerValue: 'max-age=30; note="unclosed' }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_domain", field: "headerValue" }] },
  });
});
it("ignores empty directives and requires a standalone flag", () => {
  expect(calculate({ headerValue: "max-age=30;; includeSUBdomains;" })).toEqual(
    { includeSubDomains: true },
  );
  expect(
    calculate({ headerValue: "max-age=30; includeSubDomains=invalid" }),
  ).toEqual({ includeSubDomains: false });
});
