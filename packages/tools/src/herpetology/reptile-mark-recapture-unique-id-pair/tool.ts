import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releasedIds: readonly string[];
  readonly recapturedIds: readonly string[];
};
export type Output = {
  readonly previouslyReleased: readonly string[];
  readonly novel: readonly string[];
  readonly duplicateRecaptureIds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releasedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recapturedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["releasedIds", "recapturedIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previouslyReleased: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    novel: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicateRecaptureIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["previouslyReleased", "novel", "duplicateRecaptureIds"],
} as const;
/** Audit explicit release and recapture identifier inventories without estimating abundance or capture probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { releasedIds, recapturedIds } = request;
  const compute = (): Output => {
    H.domain(new Set(releasedIds).size === releasedIds.length);
    const released = new Set(releasedIds),
      seen = new Set<string>(),
      duplicateRecaptureIds: string[] = [];
    for (const x of recapturedIds) {
      if (seen.has(x) && !duplicateRecaptureIds.includes(x))
        duplicateRecaptureIds.push(x);
      seen.add(x);
    }
    return {
      previouslyReleased: [...seen].filter((x) => released.has(x)),
      novel: [...seen].filter((x) => !released.has(x)),
      duplicateRecaptureIds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { releasedIds: ["A", "B"], recapturedIds: ["B", "C", "B"] },
  output: {
    previouslyReleased: ["B"],
    novel: ["C"],
    duplicateRecaptureIds: ["B"],
  },
} satisfies ToolExample<Input, Output>;
export const reptileMarkRecaptureUniqueIdPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-mark-recapture-unique-id-pair",
    title: "Reptile Mark Recapture Unique ID Pair Tool",
    description:
      "Audit explicit release and recapture identifier inventories without estimating abundance or capture probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        releasedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recapturedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["releasedIds", "recapturedIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previouslyReleased: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        novel: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        duplicateRecaptureIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["previouslyReleased", "novel", "duplicateRecaptureIds"],
    },
    ports: {
      inputs: [
        {
          id: "releasedIds",
          label: "Released Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recapturedIds",
          label: "Recaptured Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "previouslyReleased",
          label: "Previously Released",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "novel",
          label: "Novel",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "duplicateRecaptureIds",
          label: "Duplicate Recapture Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = reptileMarkRecaptureUniqueIdPairTool.execute;
export default reptileMarkRecaptureUniqueIdPairTool;
