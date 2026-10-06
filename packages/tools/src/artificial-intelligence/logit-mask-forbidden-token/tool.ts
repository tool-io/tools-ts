import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokenIds: readonly string[];
  readonly logits: readonly number[];
  readonly forbiddenTokenIds: readonly string[];
};
export type Output = {
  readonly allowedTokenIds: readonly string[];
  readonly allowedLogits: readonly number[];
  readonly originalIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    logits: { type: "array", maxItems: 256, items: { type: "number" } },
    forbiddenTokenIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["tokenIds", "logits", "forbiddenTokenIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowedTokenIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedLogits: { type: "array", maxItems: 256, items: { type: "number" } },
    originalIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["allowedTokenIds", "allowedLogits", "originalIndices"],
} as const;
/** Exclude explicitly forbidden token IDs from a logit vector and return surviving logits with original indices, avoiding nonportable infinite mask values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenIds, logits, forbiddenTokenIds } = request;
  const compute = (): Output => {
    H.domain(tokenIds.length === logits.length, "logits");
    H.domain(new Set(tokenIds).size === tokenIds.length, "tokenIds");
    const originalIndices = tokenIds.flatMap((v, i) =>
      forbiddenTokenIds.includes(v) ? [] : [i],
    );
    return {
      allowedTokenIds: originalIndices.map((i) => tokenIds[i]),
      allowedLogits: originalIndices.map((i) => logits[i]),
      originalIndices,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokenIds: ["a", "b", "c"],
    logits: [2, -1, 3],
    forbiddenTokenIds: ["b"],
  },
  output: {
    allowedTokenIds: ["a", "c"],
    allowedLogits: [2, 3],
    originalIndices: [0, 2],
  },
} satisfies ToolExample<Input, Output>;
export const logitMaskForbiddenTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/logit-mask-forbidden-token",
    title: "Logit Mask Forbidden Token",
    description:
      "Exclude explicitly forbidden token IDs from a logit vector and return surviving logits with original indices, avoiding nonportable infinite mask values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        logits: { type: "array", maxItems: 256, items: { type: "number" } },
        forbiddenTokenIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["tokenIds", "logits", "forbiddenTokenIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowedTokenIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allowedLogits: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        originalIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["allowedTokenIds", "allowedLogits", "originalIndices"],
    },
    ports: {
      inputs: [
        {
          id: "tokenIds",
          label: "Token Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "logits",
          label: "Logits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "forbiddenTokenIds",
          label: "Forbidden Token Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "allowedTokenIds",
          label: "Allowed Token Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allowedLogits",
          label: "Allowed Logits",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "originalIndices",
          label: "Original Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = logitMaskForbiddenTokenTool.execute;
export default logitMaskForbiddenTokenTool;
