import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("web/origin-port-equivalence", () => {
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
        firstUrl: "http://example.org:81",
        secondUrl: "http://example.org",
      }),
    ).toEqual({
      ok: true,
      output: {
        equivalent: false,
        firstOrigin: "http://example.org:81",
        secondOrigin: "http://example.org",
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

  it.each([
    { firstUrl: "invalid" },
    { firstUrl: "file:///tmp/a" },
    { secondUrl: "https://example.org:99999" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstUrl: "invalid" },
    { firstUrl: "file:///tmp/a" },
    { secondUrl: "https://example.org:99999" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

import { SimpleToolError as RegressionInputError } from "../../core/simple.js";

describe("batch 71 independent regressions", () => {
  it("normalizes zero-padded default ports", () => {
    expect(
      calculate({
        firstUrl: "https://example.org:0443/a",
        secondUrl: "https://EXAMPLE.org/b",
      }),
    ).toEqual({
      equivalent: true,
      firstOrigin: "https://example.org",
      secondOrigin: "https://example.org",
    });
    expect(
      tool.execute({
        firstUrl: "https://example.org:0443/a",
        secondUrl: "https://EXAMPLE.org/b",
      }),
    ).toEqual({
      ok: true,
      output: {
        equivalent: true,
        firstOrigin: "https://example.org",
        secondOrigin: "https://example.org",
      },
    });
  });
  it("keeps scheme part of the origin", () => {
    expect(
      calculate({
        firstUrl: "http://example.org",
        secondUrl: "https://example.org",
      }),
    ).toEqual({
      equivalent: false,
      firstOrigin: "http://example.org",
      secondOrigin: "https://example.org",
    });
    expect(
      tool.execute({
        firstUrl: "http://example.org",
        secondUrl: "https://example.org",
      }),
    ).toEqual({
      ok: true,
      output: {
        equivalent: false,
        firstOrigin: "http://example.org",
        secondOrigin: "https://example.org",
      },
    });
  });
  it("identifies an invalid URL as an input error", () => {
    const input = { ...example.input, ...{ firstUrl: "not an absolute URL" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_url", field: "url" }],
      },
    });
    expect(() => calculate(input)).toThrowError(RegressionInputError);
  });
});
