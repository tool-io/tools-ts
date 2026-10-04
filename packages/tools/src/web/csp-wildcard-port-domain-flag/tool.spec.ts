import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("web/csp-wildcard-port-domain-flag", () => {
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
        sourcePort: "",
        destinationPort: 8443,
        schemeDefaultPort: 443,
        destinationPortExplicit: true,
      }),
    ).toEqual({ ok: true, output: { portMatches: false } });
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
    "rejects nonfinite destinationPort",
    (value) =>
      expect(
        tool.execute({ ...example.input, destinationPort: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite schemeDefaultPort",
    (value) =>
      expect(
        tool.execute({ ...example.input, schemeDefaultPort: value }).ok,
      ).toBe(false),
  );
  it.each([
    { destinationPort: -1 },
    { destinationPort: 65536 },
    { schemeDefaultPort: -1 },
    { schemeDefaultPort: 65536 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { destinationPort: -1 },
    { destinationPort: 65536 },
    { schemeDefaultPort: -1 },
    { schemeDefaultPort: 65536 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("distinguishes a missing normalized port, numeric zero and leading zero digits", () => {
  expect(
    calculate({
      sourcePort: "",
      destinationPort: 443,
      schemeDefaultPort: 443,
      destinationPortExplicit: false,
    }),
  ).toEqual({ portMatches: true });
  expect(
    calculate({
      sourcePort: "00080",
      destinationPort: 80,
      schemeDefaultPort: 443,
      destinationPortExplicit: true,
    }),
  ).toEqual({ portMatches: true });
  expect(
    calculate({
      sourcePort: "0",
      destinationPort: 0,
      schemeDefaultPort: 443,
      destinationPortExplicit: true,
    }),
  ).toEqual({ portMatches: true });
  expect(
    calculate({
      sourcePort: "80",
      destinationPort: 443,
      schemeDefaultPort: 443,
      destinationPortExplicit: true,
    }),
  ).toEqual({ portMatches: false });
});
