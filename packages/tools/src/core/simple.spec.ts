import { describe, expect, it } from "vitest";
import { createSimpleTool, simpleError } from "./simple.js";
import { matchesToolJsonSchema } from "./contract.js";

describe("createSimpleTool", () => {
  it("publishes and enforces explicit nested object schemas", () => {
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "number" },
        labels: { type: "array", items: { type: "string" } },
      },
      required: ["count", "labels"],
    } as const;
    for (const result of [
      { count: 2, labels: ["a"] },
      { count: "2", labels: ["a"] },
      { count: 2, labels: [3] },
      { count: 2 },
      { count: 2, labels: [], extra: true },
    ]) {
      const tool = createSimpleTool({
        id: "test/structured",
        title: "Structured",
        description: "Validate structured output.",
        inputs: [],
        outputs: [{ id: "result", kind: "object", label: "Result", schema }],
        calculate: () => ({ result }),
      });
      expect(tool.outputSchema.properties?.result).toEqual(schema);
      expect(tool.execute({}).ok).toBe(matchesToolJsonSchema(result, schema));
    }
  });
  it("enforces nested input schemas and rejects incompatible field kinds", () => {
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: { enabled: { type: "boolean" } },
      required: ["enabled"],
    } as const;
    const tool = createSimpleTool({
      id: "test/nested-input",
      title: "Nested",
      description: "Validate input.",
      inputs: [{ id: "data", kind: "object", label: "Data", schema }],
      outputs: [],
      calculate: () => ({}),
    });
    expect(tool.execute({ data: { enabled: true } }).ok).toBe(true);
    expect(tool.execute({ data: { enabled: "yes" } })).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    expect(() =>
      createSimpleTool({
        id: "test/bad-schema",
        title: "Bad",
        description: "Reject config.",
        inputs: [{ id: "value", kind: "number", label: "Value", schema }],
        outputs: [],
        calculate: () => ({}),
      }),
    ).toThrow(TypeError);
  });
  it("rejects input accessors without reading them", () => {
    let reads = 0;
    const tool = createSimpleTool({
      id: "test/input",
      title: "Input",
      description: "Read a value.",
      inputs: [{ id: "value", kind: "number", label: "Value" }],
      outputs: [{ id: "value", kind: "number", label: "Value" }],
      calculate: (input) => ({ value: input.value }),
    });
    expect(
      tool.execute({
        get value() {
          reads += 1;
          throw new Error("Getter executed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_input", issues: [{ field: "value" }] },
    });
    expect(reads).toBe(0);
  });

  it.each([Infinity, NaN, undefined, 1n, new Map(), new Date(), Array(1)])(
    "rejects nonportable nested output: %s",
    (value) => {
      const tool = createSimpleTool({
        id: "test/nested",
        title: "Nested",
        description: "Return a nested value.",
        inputs: [],
        outputs: [{ id: "result", kind: "object", label: "Result" }],
        calculate: () => ({ result: { value } }),
      });
      expect(tool.execute({})).toMatchObject({
        ok: false,
        error: {
          code: "execution_failed",
          issues: [{ code: "invalid_output", field: "result" }],
        },
      });
    },
  );

  it("rejects cycles and accessors without invoking output getters", () => {
    let reads = 0;
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    for (const result of [
      cyclic,
      {
        get value() {
          reads += 1;
          return 1;
        },
      },
    ]) {
      const tool = createSimpleTool({
        id: "test/nested",
        title: "Nested",
        description: "Return a nested value.",
        inputs: [],
        outputs: [{ id: "result", kind: "object", label: "Result" }],
        calculate: () => ({ result }),
      });
      expect(tool.execute({}).ok).toBe(false);
    }
    expect(reads).toBe(0);
  });

  it.each([{}, { default: 2 }])(
    "requires output fields unless explicitly optional, including metadata %j",
    (metadata) => {
      const tool = createSimpleTool({
        id: "test/missing",
        title: "Missing",
        description: "Return an incomplete value.",
        inputs: [],
        outputs: [{ id: "value", kind: "number", label: "Value", ...metadata }],
        calculate: () => ({}),
      });
      expect(matchesToolJsonSchema({}, tool.outputSchema)).toBe(false);
      expect(tool.execute({})).toMatchObject({
        ok: false,
        error: { code: "execution_failed", issues: [{ field: "value" }] },
      });
    },
  );

  it("allows omitted optional outputs but validates every present value", () => {
    for (const output of [
      {},
      { value: 3 },
      { value: "3" },
      { value: undefined },
    ]) {
      const tool = createSimpleTool({
        id: "test/optional-output",
        title: "Optional",
        description: "Return an optional finite value.",
        inputs: [],
        outputs: [
          { id: "value", kind: "number", label: "Value", required: false },
        ],
        calculate: () => output,
      });
      const valid = !Object.hasOwn(output, "value") || output.value === 3;
      expect(tool.execute({}).ok).toBe(valid);
      expect(tool.outputSchema.required).toEqual([]);
      expect(tool.ports.outputs[0].required).toBe(false);
      expect(matchesToolJsonSchema(output, tool.outputSchema)).toBe(valid);
    }
  });

  it("preserves defaults and portable nested data in successful results", () => {
    const tool = createSimpleTool({
      id: "test/default",
      title: "Default",
      description: "Return a default value.",
      inputs: [{ id: "value", kind: "number", label: "Value", default: 2 }],
      outputs: [{ id: "result", kind: "object", label: "Result" }],
      calculate: (input) => ({ result: { values: [input.value, null, "😀"] } }),
    });
    const result = tool.execute({});
    expect(result).toEqual({
      ok: true,
      output: { result: { values: [2, null, "😀"] } },
    });
    if (result.ok)
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
  });

  it("distinguishes unexpected exceptions from deliberate domain input errors", () => {
    const config = {
      id: "test/failure",
      title: "Failure",
      description: "Report a failure.",
      inputs: [],
      outputs: [],
    } as const;
    expect(
      createSimpleTool({
        ...config,
        calculate: () => {
          throw new Error("Private diagnostic");
        },
      }).execute({}),
    ).toEqual({
      ok: false,
      error: {
        code: "execution_failed",
        issues: [
          {
            code: "execution_failed",
            field: "",
            message: "The calculation could not be completed.",
          },
        ],
      },
    });
    expect(
      createSimpleTool({
        ...config,
        calculate: () =>
          simpleError(
            "value",
            "Value exceeds the numerical range.",
            "numeric_range",
          ),
      }).execute({}),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "value", code: "numeric_range" }],
      },
    });
  });

  it("rejects input fields excluded by its published schema", () => {
    const tool = createSimpleTool({
      calculate: (input) => ({ doubled: (input.value as number) * 2 }),
      description: "Double a value.",
      id: "test/double",
      inputs: [{ id: "value", kind: "number", label: "Value" }],
      outputs: [{ id: "doubled", kind: "number", label: "Doubled" }],
      title: "Double",
    });

    expect(tool.execute({ extra: true, value: 2 })).toEqual({
      error: {
        issues: [
          {
            code: "unknown_field",
            field: "extra",
            message: "extra is not a supported input field.",
          },
        ],
        code: "invalid_input",
      },
      ok: false,
    });
  });

  it("rejects calculated fields excluded by its published output schema", () => {
    const tool = createSimpleTool({
      calculate: (input) => ({
        doubled: (input.value as number) * 2,
        extra: true,
      }),
      description: "Double a value.",
      id: "test/double",
      inputs: [{ id: "value", kind: "number", label: "Value" }],
      outputs: [{ id: "doubled", kind: "number", label: "Doubled" }],
      title: "Double",
    });

    expect(tool.execute({ value: 2 })).toMatchObject({
      error: { issues: [{ code: "invalid_output", field: "extra" }] },
      ok: false,
    });
  });
});
