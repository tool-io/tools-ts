import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIds: readonly string[];
  readonly pseudonyms: readonly string[];
  readonly scope: string;
};
export type Output = {
  readonly keys: readonly string[];
  readonly uniqueMapping: boolean;
  readonly collisionPseudonyms: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pseudonyms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    scope: { type: "string", maxLength: 8192 },
  },
  required: ["sourceIds", "pseudonyms", "scope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    uniqueMapping: { type: "boolean" },
    collisionPseudonyms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["keys", "uniqueMapping", "collisionPseudonyms"],
} as const;
/** Audit a supplied scoped pseudonym mapping for collisions; the operation neither creates anonymization nor authenticates identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIds, pseudonyms, scope } = request;
  const compute = (): Output => {
    H.domain(
      sourceIds.length === pseudonyms.length &&
        scope.length > 0 &&
        new Set(sourceIds).size === sourceIds.length,
    );
    const seen = new Set<string>(),
      collisionPseudonyms: string[] = [];
    for (const x of pseudonyms) {
      if (seen.has(x) && !collisionPseudonyms.includes(x))
        collisionPseudonyms.push(x);
      seen.add(x);
    }
    return {
      keys: pseudonyms.map((x) => JSON.stringify([scope, x])),
      uniqueMapping: collisionPseudonyms.length === 0,
      collisionPseudonyms,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceIds: ["A", "B"], pseudonyms: ["p1", "p1"], scope: "study" },
  output: {
    keys: ['["study","p1"]', '["study","p1"]'],
    uniqueMapping: false,
    collisionPseudonyms: ["p1"],
  },
} satisfies ToolExample<Input, Output>;
export const oncologyDataExtractPseudonymScopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/oncology-data-extract-pseudonym-scope",
    title: "Oncology Data Extract Pseudonym Scope Tool",
    description:
      "Audit a supplied scoped pseudonym mapping for collisions; the operation neither creates anonymization nor authenticates identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        pseudonyms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        scope: { type: "string", maxLength: 8192 },
      },
      required: ["sourceIds", "pseudonyms", "scope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        keys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        uniqueMapping: { type: "boolean" },
        collisionPseudonyms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["keys", "uniqueMapping", "collisionPseudonyms"],
    },
    ports: {
      inputs: [
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "pseudonyms",
          label: "Pseudonyms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "scope",
          label: "Scope",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "keys",
          label: "Keys",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "uniqueMapping",
          label: "Unique Mapping",
          valueType: { type: "boolean" },
        },
        {
          id: "collisionPseudonyms",
          label: "Collision Pseudonyms",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = oncologyDataExtractPseudonymScopeTool.execute;
export default oncologyDataExtractPseudonymScopeTool;
