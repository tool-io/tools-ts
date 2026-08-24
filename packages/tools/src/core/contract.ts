import type {
  ToolDefinition,
  ToolJsonSchema,
  ToolPortDefinition,
} from "./definition.js";
import { isToolValueType } from "./value-type.js";

export type ToolContractIssue = {
  readonly code: string;
  readonly message: string;
  readonly path: string;
};

const toolIdPattern =
  /^(?!core(?:\/|$)|runner(?:\/|$)|registry(?:\/|$)|catalog(?:\/|$))[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const datasetIdPattern = /^[a-z0-9]+(?:[/-][a-z0-9]+)*$/;
const schemaTypes = new Set([
  "array",
  "boolean",
  "integer",
  "null",
  "number",
  "object",
  "string",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const identifierListIssues = (
  value: unknown,
  path: string,
): readonly ToolContractIssue[] => {
  if (
    !Array.isArray(value) ||
    !value.every((entry) => typeof entry === "string" && entry.trim() !== "")
  )
    return [
      {
        code: "identifier_list_invalid",
        message: "Identifier lists must contain non-empty strings.",
        path,
      },
    ];
  if (new Set(value).size !== value.length)
    return [
      {
        code: "identifier_list_duplicate",
        message: "Identifier lists cannot contain duplicates.",
        path,
      },
    ];
  return [];
};

const schemaIssues = (
  schema: unknown,
  path: string,
): readonly ToolContractIssue[] => {
  if (!isRecord(schema))
    return [
      {
        code: "schema_object_required",
        message: "Schema must be an object.",
        path,
      },
    ];
  const issues: ToolContractIssue[] = [];
  if (
    schema.type === undefined &&
    schema.anyOf === undefined &&
    schema.const === undefined &&
    schema.enum === undefined
  )
    issues.push({
      code: "schema_shape_missing",
      message: "Schema must declare type, anyOf, const, or enum.",
      path,
    });
  if (schema.type !== undefined && !schemaTypes.has(String(schema.type)))
    issues.push({
      code: "schema_type_invalid",
      message: "Schema type is not supported.",
      path: `${path}/type`,
    });
  if (schema.properties !== undefined) {
    if (!isRecord(schema.properties))
      issues.push({
        code: "schema_properties_invalid",
        message: "properties must be an object.",
        path: `${path}/properties`,
      });
    else
      for (const [key, child] of Object.entries(schema.properties))
        issues.push(...schemaIssues(child, `${path}/properties/${key}`));
  }
  if (schema.items !== undefined)
    issues.push(...schemaIssues(schema.items, `${path}/items`));
  if (schema.type === "array" && schema.items === undefined)
    issues.push({
      code: "schema_items_missing",
      message: "Array schemas must declare their item schema.",
      path,
    });
  if (schema.anyOf !== undefined) {
    if (!Array.isArray(schema.anyOf) || schema.anyOf.length === 0)
      issues.push({
        code: "schema_any_of_invalid",
        message: "anyOf must contain schemas.",
        path: `${path}/anyOf`,
      });
    else
      schema.anyOf.forEach((child, index) =>
        issues.push(...schemaIssues(child, `${path}/anyOf/${index}`)),
      );
  }
  if (schema.required !== undefined) {
    if (
      !Array.isArray(schema.required) ||
      !schema.required.every((entry) => typeof entry === "string")
    )
      issues.push({
        code: "schema_required_invalid",
        message: "required must contain property names.",
        path: `${path}/required`,
      });
    else if (isRecord(schema.properties))
      for (const key of schema.required)
        if (!(key in schema.properties))
          issues.push({
            code: "schema_required_unknown",
            message: `Required property ${key} is not declared.`,
            path: `${path}/required`,
          });
  }
  if (schema.type === "object" && schema.additionalProperties === undefined)
    issues.push({
      code: "schema_additional_properties_missing",
      message: "Object schemas must state additionalProperties explicitly.",
      path,
    });
  return issues;
};

const resolveSchemaPath = (
  schema: ToolJsonSchema,
  path: readonly string[],
): ToolJsonSchema | undefined => {
  let current: ToolJsonSchema | undefined = schema;
  for (const segment of path) current = current?.properties?.[segment];
  return current;
};

const primitiveMatchesSchema = (
  port: ToolPortDefinition,
  schema: ToolJsonSchema,
): boolean => {
  const primitive = port.valueType?.type;
  if (schema.anyOf)
    return schema.anyOf.some((candidate) =>
      primitiveMatchesSchema(port, candidate),
    );
  if (primitive === "bytes") return schema.type === "string";
  if (primitive === "list") return schema.type === "array";
  if (primitive === "integer") return schema.type === "integer";
  return primitive === schema.type;
};

const portIssues = (
  definition: ToolDefinition<unknown, unknown>,
  direction: "inputs" | "outputs",
): readonly ToolContractIssue[] => {
  const ports = definition.ports?.[direction] ?? [];
  const schema =
    direction === "inputs" ? definition.inputSchema : definition.outputSchema;
  const issues: ToolContractIssue[] = [];
  const seen = new Set<string>();
  for (const port of ports) {
    const base = `/ports/${direction}/${port.id}`;
    if (seen.has(port.id))
      issues.push({
        code: "duplicate_port_id",
        message: `Port ${port.id} is duplicated.`,
        path: base,
      });
    seen.add(port.id);
    if (!/^[a-z][A-Za-z0-9]*$/.test(port.id))
      issues.push({
        code: "port_id_invalid",
        message: "Port IDs must use lower camel case.",
        path: `${base}/id`,
      });
    if (typeof port.label !== "string" || port.label.trim() === "")
      issues.push({
        code: "port_label_required",
        message: "Every port needs a non-empty label.",
        path: `${base}/label`,
      });
    if (!isToolValueType(port.valueType))
      issues.push({
        code: "port_value_type_invalid",
        message: "Every port needs a valid valueType.",
        path: `${base}/valueType`,
      });
    const path = port.path ?? [port.id];
    if (
      path.some(
        (segment) => typeof segment !== "string" || segment.trim() === "",
      )
    ) {
      issues.push({
        code: "port_path_invalid",
        message: "Port path segments must be non-empty schema property names.",
        path: `${base}/path`,
      });
      continue;
    }
    const portSchema = resolveSchemaPath(schema, path);
    if (!portSchema)
      issues.push({
        code: "port_schema_path_missing",
        message: `Schema path ${path.join(".")} does not exist.`,
        path: base,
      });
    else if (port.valueType && !primitiveMatchesSchema(port, portSchema))
      issues.push({
        code: "port_schema_type_mismatch",
        message: "Port primitive does not match its schema.",
        path: base,
      });
    if (direction === "inputs" && port.required) {
      let parent: ToolJsonSchema | undefined = schema;
      const requiredPath = path.every((segment) => {
        const required = parent?.required?.includes(segment) ?? false;
        parent = parent?.properties?.[segment];
        return required;
      });
      if (!requiredPath)
        issues.push({
          code: "required_port_schema_optional",
          message: "Required port is optional in its schema.",
          path: base,
        });
    }
  }
  return issues;
};

export const validateToolContract = (
  value: unknown,
): readonly ToolContractIssue[] => {
  if (!isRecord(value))
    return [
      {
        code: "definition_object_required",
        message: "Tool definition must be an object.",
        path: "",
      },
    ];
  const definition = value as unknown as ToolDefinition<unknown, unknown>;
  const issues: ToolContractIssue[] = [];
  if (!toolIdPattern.test(String(definition.id ?? "")))
    issues.push({
      code: "tool_id_invalid",
      message: "Tool ID is invalid or reserved.",
      path: "/id",
    });
  if (
    !Number.isSafeInteger(definition.contractVersion) ||
    definition.contractVersion < 1
  )
    issues.push({
      code: "contract_version_invalid",
      message: "contractVersion must be a positive safe integer.",
      path: "/contractVersion",
    });
  if (typeof definition.title !== "string" || definition.title.trim() === "")
    issues.push({
      code: "title_required",
      message: "Tool title is required.",
      path: "/title",
    });
  if (
    typeof definition.description !== "string" ||
    definition.description.trim() === ""
  )
    issues.push({
      code: "description_required",
      message: "Tool description is required.",
      path: "/description",
    });
  if (typeof definition.execute !== "function")
    issues.push({
      code: "execute_required",
      message: "Tool execute function is required.",
      path: "/execute",
    });
  if (definition.discovery !== undefined) {
    if (!isRecord(definition.discovery))
      issues.push({
        code: "discovery_invalid",
        message: "Discovery metadata must be an object.",
        path: "/discovery",
      });
    else
      for (const key of [
        "aliases",
        "collections",
        "fields",
        "keywords",
      ] as const) {
        const list = definition.discovery[key];
        if (list !== undefined)
          issues.push(...identifierListIssues(list, `/discovery/${key}`));
      }
  }
  if (
    !definition.execution ||
    !["data", "device", "pure", "remote"].includes(definition.execution.kind)
  )
    issues.push({
      code: "execution_invalid",
      message: "Tool execution requirements are missing or invalid.",
      path: "/execution",
    });
  else {
    const capabilityIds = new Set<string>();
    for (const [index, capability] of (
      definition.execution.capabilities ?? []
    ).entries()) {
      if (
        !isRecord(capability) ||
        typeof capability.id !== "string" ||
        !datasetIdPattern.test(capability.id) ||
        !Number.isSafeInteger(capability.schemaVersion) ||
        capability.schemaVersion < 1 ||
        typeof capability.required !== "boolean"
      )
        issues.push({
          code: "capability_requirement_invalid",
          message:
            "Capability requirements need an ID, positive schema version, and required flag.",
          path: `/execution/capabilities/${index}`,
        });
      else if (capabilityIds.has(capability.id))
        issues.push({
          code: "capability_requirement_duplicate",
          message: `Capability ${capability.id} is required more than once.`,
          path: `/execution/capabilities/${index}`,
        });
      capabilityIds.add(String(capability.id));
    }
    const datasetIds = new Set<string>();
    for (const [index, dataset] of (
      definition.execution.datasets ?? []
    ).entries()) {
      if (
        typeof dataset.id !== "string" ||
        !datasetIdPattern.test(dataset.id) ||
        !Number.isSafeInteger(dataset.schemaVersion) ||
        dataset.schemaVersion < 1
      )
        issues.push({
          code: "dataset_requirement_invalid",
          message:
            "Dataset requirements need an ID and positive schema version.",
          path: `/execution/datasets/${index}`,
        });
      else if (datasetIds.has(dataset.id))
        issues.push({
          code: "dataset_requirement_duplicate",
          message: `Dataset ${dataset.id} is required more than once.`,
          path: `/execution/datasets/${index}`,
        });
      datasetIds.add(dataset.id);
    }
    if (
      definition.execution.kind === "pure" &&
      ((definition.execution.datasets?.length ?? 0) > 0 ||
        (definition.execution.capabilities?.length ?? 0) > 0)
    )
      issues.push({
        code: "pure_tool_has_requirements",
        message: "Pure tools cannot require datasets or runtime capabilities.",
        path: "/execution",
      });
  }
  issues.push(...schemaIssues(definition.inputSchema, "/inputSchema"));
  issues.push(...schemaIssues(definition.outputSchema, "/outputSchema"));
  if (!definition.ports)
    issues.push({
      code: "ports_required",
      message: "Every public tool needs named input and output ports.",
      path: "/ports",
    });
  else {
    issues.push(...portIssues(definition, "inputs"));
    issues.push(...portIssues(definition, "outputs"));
  }
  return issues;
};
