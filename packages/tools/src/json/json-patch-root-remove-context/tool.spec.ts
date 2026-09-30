import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("json/json-patch-root-remove-context", () => {
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
        path: "/",
        operation: "remove",
        rootPresent: true,
        rootRemovalPolicy: "reject",
      }),
    ).toEqual({
      ok: true,
      output: { removesDocument: false, applicable: false },
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
    { operation: "__invalid_enum__" },
    { rootRemovalPolicy: "__invalid_enum__" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { operation: "__invalid_enum__" },
    { rootRemovalPolicy: "__invalid_enum__" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

it("requires an explicit application policy before removing the document root", () => {
  expect(
    calculate({
      path: "",
      operation: "remove",
      rootPresent: true,
      rootRemovalPolicy: "reject",
    }),
  ).toEqual({ removesDocument: true, applicable: false });
  expect(
    calculate({
      path: "",
      operation: "remove",
      rootPresent: true,
      rootRemovalPolicy: "allow-document-absence",
    }),
  ).toEqual({ removesDocument: true, applicable: true });
  expect(
    calculate({
      path: "/",
      operation: "remove",
      rootPresent: true,
      rootRemovalPolicy: "allow-document-absence",
    }),
  ).toEqual({ removesDocument: false, applicable: false });
});
