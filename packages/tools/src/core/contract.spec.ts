import { describe, expect, it } from "vitest";
import { bodyMassIndexTool } from "../body-mass-index/tool.js";
import { matchesToolJsonSchema, validateToolContract } from "./contract.js";
import type { ToolJsonSchema } from "./definition.js";

describe("tool contract linter", () => {
  it.each(["constructor", "__proto__", "toString"])(
    "rejects undeclared own property %s in closed schemas",
    (key) => {
      const value = Object.fromEntries([[key, 123]]);
      expect(
        matchesToolJsonSchema(value, {
          type: "object",
          properties: {},
          additionalProperties: false,
        }),
      ).toBe(false);
      expect(
        matchesToolJsonSchema(value, {
          type: "object",
          properties: {},
          additionalProperties: { type: "string" },
        }),
      ).toBe(false);
      expect(
        matchesToolJsonSchema(value, {
          type: "object",
          properties: Object.fromEntries([[key, { type: "number" }]]),
          additionalProperties: false,
        }),
      ).toBe(true);
    },
  );

  it("counts Unicode code points for schema string lengths", () => {
    const schema = { type: "string", minLength: 1, maxLength: 1 } as const;
    expect(matchesToolJsonSchema("😀", schema)).toBe(true);
    expect(matchesToolJsonSchema("𐐀", schema)).toBe(true);
    expect(matchesToolJsonSchema("😀a", schema)).toBe(false);
    expect(matchesToolJsonSchema("e\u0301", schema)).toBe(false);
  });

  it("rejects nonportable values even inside unrestricted JSON objects", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const schema = { type: "object", additionalProperties: true } as const;
    for (const value of [
      { number: Infinity },
      { number: NaN },
      { missing: undefined },
      { list: Array(1) },
      { object: new Date() },
      cyclic,
    ])
      expect(matchesToolJsonSchema(value, schema)).toBe(false);
    const shared = { value: 1 };
    expect(
      matchesToolJsonSchema({ first: shared, second: shared }, schema),
    ).toBe(true);
  });

  it.each([
    { execution: { kind: "data", datasets: [null] } },
    { execution: { kind: "data", datasets: {} } },
    { execution: { kind: "device", capabilities: [null] } },
    { execution: { kind: "device", capabilities: {} } },
    { ports: { inputs: [null], outputs: [] } },
    { ports: { inputs: {}, outputs: [] } },
    { inputSchema: { type: "string", default: "x", anyOf: {} } },
    { inputSchema: { type: "string", pattern: "[" } },
    { inputSchema: null },
  ])("reports malformed contract metadata without throwing: %j", (patch) => {
    expect(
      validateToolContract({ ...bodyMassIndexTool, ...patch }).length,
    ).toBeGreaterThan(0);
  });

  it("rejects cyclic and malformed runtime schemas without throwing", () => {
    const schema: { type: "array"; items?: ToolJsonSchema } = { type: "array" };
    schema.items = schema;
    expect(matchesToolJsonSchema([], schema)).toBe(false);
    expect(
      validateToolContract({ ...bodyMassIndexTool, inputSchema: schema }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "schema_not_portable",
          path: "/inputSchema",
        }),
      ]),
    );
    expect(
      matchesToolJsonSchema("x", { type: "string", anyOf: {} } as never),
    ).toBe(false);
  });

  it("does not resolve inherited schema properties as real port paths", () => {
    const definition = {
      ...bodyMassIndexTool,
      inputSchema: {
        type: "object",
        properties: {},
        required: ["constructor"],
        additionalProperties: false,
      },
      ports: {
        inputs: [
          {
            id: "constructor",
            label: "Constructor",
            required: true,
            valueType: { type: "object" },
          },
        ],
        outputs: bodyMassIndexTool.ports.outputs,
      },
    };
    expect(validateToolContract(definition).map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "schema_required_unknown",
        "port_schema_path_missing",
      ]),
    );
  });

  it("matches portable values against object, collection, and numeric constraints", () => {
    expect(
      matchesToolJsonSchema(
        { values: [1, 2, 3] },
        {
          additionalProperties: false,
          properties: {
            values: {
              items: { minimum: 0, type: "number" },
              minItems: 1,
              type: "array",
            },
          },
          required: ["values"],
          type: "object",
        },
      ),
    ).toBe(true);
    expect(
      matchesToolJsonSchema(
        { extra: true, values: [-1] },
        {
          additionalProperties: false,
          properties: {
            values: {
              items: { minimum: 0, type: "number" },
              type: "array",
            },
          },
          required: ["values"],
          type: "object",
        },
      ),
    ).toBe(false);
  });

  it("accepts a complete portable definition", () => {
    expect(validateToolContract(bodyMassIndexTool)).toEqual([]);
  });

  it("reports incomplete schemas and missing value types without a validator dependency", () => {
    const invalid = {
      ...bodyMassIndexTool,
      inputSchema: {
        additionalProperties: false,
        properties: {},
        type: "object",
      },
      ports: {
        ...bodyMassIndexTool.ports,
        inputs: [
          {
            id: "weightKg",
            label: "Weight",
            required: true,
            valueType: undefined,
          },
        ],
      },
    };
    expect(validateToolContract(invalid).map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "port_value_type_invalid",
        "port_schema_path_missing",
        "required_port_schema_optional",
      ]),
    );
  });

  it("rejects defaults and schema lists that contradict their declarations", () => {
    const invalid = {
      ...bodyMassIndexTool,
      inputSchema: {
        ...bodyMassIndexTool.inputSchema,
        properties: {
          ...bodyMassIndexTool.inputSchema.properties,
          weightKg: {
            default: -1,
            enum: [-1, -1],
            minimum: 0,
            type: "number" as const,
          },
        },
        required: ["heightCm", "heightCm", "weightKg"],
      },
    };

    expect(validateToolContract(invalid).map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "schema_default_invalid",
        "schema_enum_duplicate",
        "schema_required_duplicate",
      ]),
    );
  });

  it("keeps schema-required inputs and port paths unambiguous", () => {
    const weightPort = bodyMassIndexTool.ports.inputs[0];
    const invalid = {
      ...bodyMassIndexTool,
      ports: {
        ...bodyMassIndexTool.ports,
        inputs: [
          { ...weightPort, required: false },
          {
            ...weightPort,
            id: "duplicateWeight",
            path: weightPort.path ?? [weightPort.id],
          },
          bodyMassIndexTool.ports.inputs[1],
        ],
      },
    };

    expect(validateToolContract(invalid).map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "duplicate_port_path",
        "required_schema_port_optional",
      ]),
    );
  });

  it("rejects requirements on a pure tool", () => {
    expect(
      validateToolContract({
        ...bodyMassIndexTool,
        execution: {
          capabilities: [
            { id: "device/camera/capture", required: true, schemaVersion: 1 },
          ],
          kind: "pure",
        },
      }).map(({ code }) => code),
    ).toContain("pure_tool_has_requirements");
  });

  it("validates versioned capability requirements", () => {
    const definition = {
      ...bodyMassIndexTool,
      execution: {
        capabilities: [
          {
            id: "device/sensors/enumerate",
            required: true,
            schemaVersion: 1,
          },
        ],
        kind: "device" as const,
      },
    };
    expect(validateToolContract(definition)).toEqual([]);
    expect(
      validateToolContract({
        ...definition,
        execution: {
          ...definition.execution,
          capabilities: [
            {
              id: "device/sensors/enumerate",
              required: true,
              schemaVersion: 0,
            },
          ],
        },
      }).map(({ code }) => code),
    ).toContain("capability_requirement_invalid");
  });

  it("rejects malformed discovery metadata and port presentation", () => {
    const invalid = {
      ...bodyMassIndexTool,
      discovery: { aliases: ["BMI", " bmi "] },
      ports: {
        ...bodyMassIndexTool.ports,
        inputs: [
          {
            ...bodyMassIndexTool.ports.inputs[0],
            id: "WeightKg",
            label: "",
            presentation: { kind: "table", version: 1 },
          },
        ],
      },
    };

    expect(validateToolContract(invalid).map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "identifier_list_duplicate",
        "port_id_invalid",
        "port_label_required",
        "input_presentation_not_allowed",
      ]),
    );
  });
});
