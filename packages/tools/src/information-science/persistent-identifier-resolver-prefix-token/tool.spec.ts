import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("information-science/persistent-identifier-resolver-prefix-token", () => {
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
        resolverPrefix: "https://resolver.test/",
        identifier: "123",
      }),
    ).toEqual({ ok: true, output: { url: "https://resolver.test/123" } });
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

  it.each([
    { identifier: "\ud800" },
    { identifier: "\udc00" },
    { identifier: "a\ud800z" },
    { identifier: "" },
    { resolverPrefix: "ftp://example.test/" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { identifier: "\ud800" },
    { identifier: "\udc00" },
    { identifier: "a\ud800z" },
    { identifier: "" },
    { resolverPrefix: "ftp://example.test/" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 66 review regressions", () => {
  it("percent-encodes a valid supplementary Unicode character", () => {
    expect(
      calculate({ resolverPrefix: "https://example.test/", identifier: "A😀" }),
    ).toEqual({ url: "https://example.test/A%F0%9F%98%80" });
  });
  it("reports an unpaired surrogate as an identifier domain issue", () => {
    expect(
      tool.execute({
        resolverPrefix: "https://example.test/",
        identifier: "\ud800",
      }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "identifier", code: "invalid_domain" }],
      },
    });
  });
});
