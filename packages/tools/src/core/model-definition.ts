import {
  defineTool,
  type ToolDefinition,
  type ToolJsonSchema,
} from "./definition.js";
import type { ToolValueType } from "./value-type.js";
import { matchesToolJsonSchema } from "./contract.js";
import type { ToolIssue } from "./result.js";

/** Reject sparse/cyclic/accessor-backed values before invoking the schema matcher. */
const isModelData = (input: unknown): boolean => {
  const active = new Set<object>();
  let nodes = 0,
    characters = 0;
  const visit = (value: unknown, depth: number): boolean => {
    nodes += 1;
    if (nodes > 50_000 || depth > 24) return false;
    if (value === null || typeof value === "boolean") return true;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "string") {
      characters += value.length;
      return value.length <= 65_536 && characters <= 1_000_000;
    }
    if (typeof value !== "object" || active.has(value)) return false;
    active.add(value);
    let valid = true;
    if (Array.isArray(value)) {
      valid =
        value.length <= 50_000 &&
        Reflect.ownKeys(value).length === value.length + 1;
      for (let i = 0; valid && i < value.length; i += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
        valid =
          descriptor !== undefined &&
          Object.hasOwn(descriptor, "value") &&
          visit(descriptor.value, depth + 1);
      }
    } else {
      const prototype: unknown = Object.getPrototypeOf(value);
      const keys = Reflect.ownKeys(value);
      valid =
        (prototype === Object.prototype || prototype === null) &&
        keys.length <= 4096;
      for (const key of keys) {
        if (!valid) break;
        if (typeof key !== "string" || key.length > 1024) {
          valid = false;
          break;
        }
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        valid =
          descriptor !== undefined &&
          descriptor.enumerable === true &&
          Object.hasOwn(descriptor, "value") &&
          visit(descriptor.value, depth + 1);
      }
    }
    active.delete(value);
    return valid;
  };
  return visit(input, 0);
};

/** Overlay own-property schema lookup without changing the legacy matcher. */
const matchesOwnSchema = (value: unknown, schema: ToolJsonSchema): boolean => {
  if (!matchesToolJsonSchema(value, schema)) return false;
  if (
    schema.anyOf &&
    !schema.anyOf.some((candidate) => matchesOwnSchema(value, candidate))
  )
    return false;
  if (schema.type === "array" && Array.isArray(value) && schema.items)
    return value.every((item) => matchesOwnSchema(item, schema.items ?? {}));
  if (
    schema.type === "object" &&
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    const properties = schema.properties ?? {};
    for (const [key, item] of Object.entries(value)) {
      const declared = Object.hasOwn(properties, key);
      if (!declared && schema.additionalProperties === false) return false;
      const child = declared
        ? properties[key]
        : typeof schema.additionalProperties === "object"
          ? schema.additionalProperties
          : undefined;
      if (child && !matchesOwnSchema(item, child)) return false;
    }
  }
  return true;
};

export const matchesModelInput = (
  input: unknown,
  schema: ToolJsonSchema,
): boolean => isModelData(input) && matchesOwnSchema(input, schema);

/** Top-level schema diagnostics after a model-specific schema guard fails. */
export const modelInputIssues = (
  input: unknown,
  schema: ToolJsonSchema,
): readonly ToolIssue[] => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return [
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ];
  const descriptors = Object.getOwnPropertyDescriptors(input);
  const accessor = Object.entries(descriptors).find(
    ([, descriptor]) => !Object.hasOwn(descriptor, "value"),
  );
  if (accessor)
    return [
      {
        code: "invalid_field",
        field: accessor[0],
        message: "Input fields must be plain data properties, not accessors.",
      },
    ];
  const values = Object.fromEntries(
    Object.entries(descriptors)
      .filter(([, descriptor]) => descriptor.enumerable)
      .map(([field, descriptor]) => [field, descriptor.value]),
  );
  const issues: ToolIssue[] = [];
  for (const [field, fieldSchema] of Object.entries(schema.properties ?? {})) {
    if (!Object.hasOwn(values, field)) {
      if (schema.required?.includes(field))
        issues.push({
          code: "required_field",
          field,
          message: `${field} is required.`,
        });
    } else if (!matchesModelInput(values[field], fieldSchema))
      issues.push({
        code: "invalid_field",
        field,
        message: `${field} does not match its declared type or bounds.`,
      });
  }
  if (schema.additionalProperties === false)
    for (const field of Object.keys(values))
      if (!Object.hasOwn(schema.properties ?? {}, field))
        issues.push({
          code: "unknown_field",
          field,
          message: `${field} is not a supported input field.`,
        });
  return issues.length
    ? issues
    : [
        {
          code: "invalid_input",
          field: "",
          message: "Input does not match the declared schema.",
        },
      ];
};

const hasConcretePortType = (schema: ToolJsonSchema): boolean =>
  schema.type !== undefined &&
  (schema.type !== "array" ||
    (schema.items !== undefined && hasConcretePortType(schema.items)));

/** Contract boilerplate only: every caller supplies its own model and executor.
 * Outputs containing unions use an honest whole-object port, not a falsely
 * concrete primitive port. Ambiguous input ports still require explicit design.
 */
const valueTypeFromSchema = (schema: ToolJsonSchema): ToolValueType => {
  if (schema.type === "array" && schema.items)
    return { items: valueTypeFromSchema(schema.items), type: "list" };
  if (
    schema.type === "boolean" ||
    schema.type === "integer" ||
    schema.type === "null" ||
    schema.type === "number" ||
    schema.type === "object" ||
    schema.type === "string"
  )
    return {
      ...(schema.format ? { format: schema.format } : {}),
      type: schema.type,
    };
  throw new TypeError(
    "Model ports require a concrete schema type, including array item types.",
  );
};

export const createModelDefinition = <Input, Output>(
  config: Pick<
    ToolDefinition<Input, Output>,
    "description" | "execute" | "id" | "inputSchema" | "outputSchema" | "title"
  > &
    Partial<Pick<ToolDefinition<Input, Output>, "execution">>,
): ToolDefinition<Input, Output> =>
  defineTool({
    ...config,
    contractVersion: 1,
    execution: config.execution ?? { kind: "pure" },
    ports: {
      inputs: Object.entries(config.inputSchema.properties ?? {}).map(
        ([id, schema]) => ({
          id,
          label: schema.description ?? id,
          required: config.inputSchema.required?.includes(id) ?? false,
          valueType: valueTypeFromSchema(schema),
        }),
      ),
      outputs: Object.values(config.outputSchema.properties ?? {}).every(
        hasConcretePortType,
      )
        ? Object.entries(config.outputSchema.properties ?? {}).map(
            ([id, schema]) => ({
              id,
              label: schema.description ?? id,
              valueType: valueTypeFromSchema(schema),
            }),
          )
        : [
            {
              id: "result",
              label: "Result",
              path: [],
              valueType: { type: "object" },
            },
          ],
    },
  });
