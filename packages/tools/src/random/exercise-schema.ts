import type { ToolDefinition, ToolJsonSchema } from "../core/definition.js";

const object = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required: Object.keys(properties),
});
const array = (items: ToolJsonSchema): ToolJsonSchema => ({
  type: "array",
  items,
});
const text: ToolJsonSchema = { type: "string" };
const index: ToolJsonSchema = { type: "integer", minimum: 0 };

/** Reuse the imported calculator's real contracts, not the shape of one answer. */
export const corpusResultSchema = (
  base: ToolDefinition<unknown, unknown>,
  extensions: {
    readonly result?: Readonly<Record<string, ToolJsonSchema>>;
    readonly exercise?: Readonly<Record<string, ToolJsonSchema>>;
  } = {},
): ToolJsonSchema =>
  object({
    baseToolId: text,
    selectedCandidateIndices: array(index),
    unusedCandidateIndices: array(index),
    exercises: array(
      object({
        input: base.inputSchema,
        answer: base.outputSchema,
        ...extensions.exercise,
      }),
    ),
    ...extensions.result,
  });

const valueType: ToolJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: {
      type: "string",
      enum: [
        "null",
        "boolean",
        "integer",
        "number",
        "string",
        "bytes",
        "list",
        "object",
      ],
    },
    unit: text,
    format: text,
    // Nested portable list descriptors are intentionally extensible metadata.
    items: { type: "object", additionalProperties: true },
  },
  required: ["type"],
};
const port: ToolJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: text,
    label: text,
    description: text,
    path: array(text),
    required: { type: "boolean" },
    valueType,
    presentation: object({
      kind: { type: "string", enum: ["chart", "map", "table"] },
      version: { type: "integer", const: 1 },
    }),
  },
  required: ["id", "label", "valueType"],
};
const issue = object({ code: text, field: text, message: text });
const requirement = object({
  id: text,
  schemaVersion: { type: "integer", minimum: 1 },
});
const error: ToolJsonSchema = {
  anyOf: [
    object({
      code: {
        type: "string",
        enum: ["invalid_input", "execution_failed", "execution_cancelled"],
      },
      issues: array(issue),
    }),
    object({
      code: { type: "string", const: "capability_unavailable" },
      issues: array(issue),
      capability: requirement,
    }),
    object({
      code: { type: "string", const: "dataset_unavailable" },
      issues: array(issue),
      dataset: requirement,
    }),
  ],
};
export const practiceResultSchema = (
  base: ToolDefinition<unknown, unknown>,
): ToolJsonSchema =>
  object({
    status: {
      type: "string",
      enum: ["ok", "empty-eligible-bank", "insufficient-eligible-bank"],
    },
    baseToolId: text,
    model: object({
      description: text,
      inputs: array(port),
      outputs: array(port),
    }),
    replay: object({
      seed: text,
      source: { type: "string", enum: ["seeded", "injected"] },
      count: index,
      withoutReplacement: { type: "boolean" },
      draws: index,
    }),
    eligibleCandidateIds: array(text),
    rejected: array(object({ id: text, index, error })),
    exercises: array(
      object({
        candidateId: text,
        sourceIndex: index,
        prompt: base.inputSchema,
        answer: base.outputSchema,
      }),
    ),
  });

/** The bounded practice helper also reports its source-specific resource limits. */
export const boundedPracticeResultSchema = (
  base: ToolDefinition<unknown, unknown>,
): ToolJsonSchema => {
  const schema = practiceResultSchema(base);
  return {
    ...schema,
    properties: {
      ...schema.properties,
      practiceLimits: {
        type: "object",
        additionalProperties: { type: "number" },
      },
    },
    required: [...(schema.required ?? []), "practiceLimits"],
  };
};
