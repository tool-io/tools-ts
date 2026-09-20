import { describe, expect, it } from "vitest";
import { validateToolContract } from "./contract.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "./model-definition.js";
import { toolSuccess } from "./result.js";

const schema = {
  additionalProperties: false,
  properties: { values: { items: { type: "number" }, type: "array" } },
  required: ["values"],
  type: "object",
} as const;

describe("bounded model input and contract helpers", () => {
  it("accepts dense finite JSON data and rejects sparse/non-finite arrays", () => {
    expect(matchesModelInput({ values: [1, 2, 3] }, schema)).toBe(true);
    for (const values of [Array(3), [1, NaN], [1, Infinity], [1, undefined]]) {
      expect(matchesModelInput({ values }, schema)).toBe(false);
      expect(modelInputIssues({ values }, schema)[0]).toMatchObject({
        code: "invalid_field",
        field: "values",
      });
    }
  });
  it("never invokes accessor-backed input", () => {
    let reads = 0;
    const input = {
      get values(): number[] {
        reads += 1;
        throw new Error("Must not read");
      },
    };
    expect(matchesModelInput(input, schema)).toBe(false);
    expect(modelInputIssues(input, schema)[0]).toMatchObject({
      code: "invalid_field",
      field: "values",
    });
    expect(reads).toBe(0);
    const values = [1, 2];
    Object.defineProperty(values, "0", {
      enumerable: true,
      get: () => {
        throw new Error("Must not read");
      },
    });
    expect(matchesModelInput({ values }, schema)).toBe(false);
  });
  it("rejects cycles, excess depth, non-JSON records, and oversized text", () => {
    const open = { additionalProperties: true, type: "object" } as const;
    const cycle: { self?: object } = {};
    cycle.self = cycle;
    expect(matchesModelInput(cycle, open)).toBe(false);
    const nested: Record<string, unknown> = {};
    let cursor = nested;
    for (let depth = 0; depth < 32; depth += 1) {
      const next: Record<string, unknown> = {};
      cursor.child = next;
      cursor = next;
    }
    expect(matchesModelInput(nested, open)).toBe(false);
    expect(matchesModelInput({ values: new Date(0) }, open)).toBe(false);
    expect(matchesModelInput({ values: "x".repeat(65_537) }, open)).toBe(false);
    const hidden = {};
    Object.defineProperty(hidden, "values", { value: [1], enumerable: false });
    expect(matchesModelInput(hidden, schema)).toBe(false);
  });
  it("allows repeated references that are not cycles", () => {
    const data = { x: 3 };
    expect(
      matchesModelInput(
        { first: data, second: data },
        { additionalProperties: true, type: "object" },
      ),
    ).toBe(true);
  });
  it("distinguishes root, missing, malformed, and unknown fields", () => {
    expect(modelInputIssues(null, schema)).toMatchObject([
      { code: "object_required", field: "" },
    ]);
    expect(modelInputIssues({}, schema)).toMatchObject([
      { code: "required_field", field: "values" },
    ]);
    expect(modelInputIssues({ values: "no" }, schema)).toMatchObject([
      { code: "invalid_field", field: "values" },
    ]);
    expect(modelInputIssues({ values: [1], extra: 2 }, schema)).toMatchObject([
      { code: "unknown_field", field: "extra" },
    ]);
  });
  it("does not mistake inherited JavaScript property names for declared schema fields", () => {
    for (const name of ["constructor", "toString", "__proto__"]) {
      const input = Object.fromEntries([
        ["values", [1, 2]],
        [name, "unexpected"],
      ]);
      expect(matchesModelInput(input, schema)).toBe(false);
      expect(modelInputIssues(input, schema)).toMatchObject([
        { code: "unknown_field", field: name },
      ]);
    }
    const openNumeric = {
      additionalProperties: { type: "number" },
      type: "object",
    } as const;
    expect(
      matchesModelInput(
        Object.fromEntries([["constructor", "not a number"]]),
        openNumeric,
      ),
    ).toBe(false);
    expect(
      matchesModelInput(Object.fromEntries([["constructor", 3]]), openNumeric),
    ).toBe(true);
  });
  it("derives concrete chaining ports without implementing model semantics", () => {
    const execute = () => toolSuccess({ count: 2 });
    const definition = createModelDefinition<
      { readonly values: readonly number[] },
      { readonly count: number }
    >({
      id: "testing/model-contract",
      title: "Model Contract",
      description: "Demonstrate contract-only boilerplate.",
      inputSchema: schema,
      outputSchema: {
        additionalProperties: false,
        properties: { count: { type: "integer" } },
        required: ["count"],
        type: "object",
      },
      execute,
    });
    expect(validateToolContract(definition)).toEqual([]);
    expect(definition.execute).toBe(execute);
    expect(definition.ports.inputs).toEqual([
      {
        id: "values",
        label: "values",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
    ]);
    expect(definition.ports.outputs).toEqual([
      { id: "count", label: "count", valueType: { type: "integer" } },
    ]);
  });
  it("does not disguise ambiguous union ports as another concrete value type", () => {
    expect(() =>
      createModelDefinition({
        id: "testing/ambiguous-model",
        title: "Ambiguous Model",
        description: "Reject unsupported implicit port derivation.",
        inputSchema: {
          additionalProperties: false,
          properties: {
            value: { anyOf: [{ type: "number" }, { type: "null" }] },
          },
          type: "object",
        },
        outputSchema: {
          additionalProperties: false,
          properties: {},
          type: "object",
        },
        execute: () => toolSuccess({}),
      }),
    ).toThrow(TypeError);
  });
  it("represents nullable or mixed-list outputs through the complete concrete output object", () => {
    const outputSchema = {
      type: "object",
      additionalProperties: false,
      properties: {
        mean: { anyOf: [{ type: "number" }, { type: "null" }] },
        entries: {
          type: "array",
          items: { anyOf: [{ type: "string" }, { type: "null" }] },
        },
      },
      required: ["mean", "entries"],
    } as const;
    const definition = createModelDefinition({
      id: "testing/nullable-output",
      title: "Nullable Output",
      description:
        "Expose a complete result object without inventing a union primitive.",
      inputSchema: schema,
      outputSchema,
      execute: () => toolSuccess({ mean: null, entries: ["a", null] }),
    });
    expect(definition.ports.outputs).toEqual([
      {
        id: "result",
        label: "Result",
        path: [],
        valueType: { type: "object" },
      },
    ]);
    expect(validateToolContract(definition)).toEqual([]);
  });
  it("preserves an explicit normalized-data requirement without acquiring data", () => {
    const execution = {
      kind: "data",
      datasets: [{ id: "nutrition/food-composition", schemaVersion: 1 }],
    } as const;
    const definition = createModelDefinition({
      id: "testing/data-model",
      title: "Normalized Data Model",
      description: "Declare supplied normalized data.",
      execution,
      inputSchema: schema,
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { count: { type: "integer" } },
        required: ["count"],
      },
      execute: () => toolSuccess({ count: 0 }),
    });
    expect(definition.execution).toEqual(execution);
    expect(validateToolContract(definition)).toEqual([]);
  });
});
