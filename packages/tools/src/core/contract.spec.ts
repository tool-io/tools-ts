import { describe, expect, it } from "vitest";
import { bodyMassIndexTool } from "../body-mass-index/tool.js";
import { validateToolContract } from "./contract.js";

describe("tool contract linter", () => {
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
      discovery: { aliases: ["BMI", "BMI"] },
      ports: {
        ...bodyMassIndexTool.ports,
        inputs: [
          {
            ...bodyMassIndexTool.ports.inputs[0],
            id: "WeightKg",
            label: "",
          },
        ],
      },
    };

    expect(validateToolContract(invalid).map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "identifier_list_duplicate",
        "port_id_invalid",
        "port_label_required",
      ]),
    );
  });
});
