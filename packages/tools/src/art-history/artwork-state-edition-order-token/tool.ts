import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stateOrder: number;
  readonly editionOrder: number;
  readonly orderBasis: string;
};
export type Output = {
  readonly key: readonly number[];
  readonly basis: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateOrder: { type: "integer", minimum: 0 },
    editionOrder: { type: "integer", minimum: 0 },
    orderBasis: {
      type: "string",
      maxLength: 8192,
      enum: ["state-first", "edition-first"],
    },
  },
  required: ["stateOrder", "editionOrder", "orderBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "array", maxItems: 256, items: { type: "integer" } },
    basis: { type: "string", maxLength: 8192 },
  },
  required: ["key", "basis"],
} as const;
/** Build an explicit numeric ordering key without inferring an artwork state or edition chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateOrder, editionOrder, orderBasis } = request;
  const compute = (): Output => {
    H.integer(stateOrder, 0);
    H.integer(editionOrder, 0);
    H.domain(["state-first", "edition-first"].includes(orderBasis));
    return {
      key:
        orderBasis === "state-first"
          ? [stateOrder, editionOrder]
          : [editionOrder, stateOrder],
      basis: orderBasis,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stateOrder: 2, editionOrder: 5, orderBasis: "state-first" },
  output: { key: [2, 5], basis: "state-first" },
} satisfies ToolExample<Input, Output>;
export const artworkStateEditionOrderTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-state-edition-order-token",
    title: "Artwork State Edition Order Token Tool",
    description:
      "Build an explicit numeric ordering key without inferring an artwork state or edition chronology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateOrder: { type: "integer", minimum: 0 },
        editionOrder: { type: "integer", minimum: 0 },
        orderBasis: {
          type: "string",
          maxLength: 8192,
          enum: ["state-first", "edition-first"],
        },
      },
      required: ["stateOrder", "editionOrder", "orderBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "array", maxItems: 256, items: { type: "integer" } },
        basis: { type: "string", maxLength: 8192 },
      },
      required: ["key", "basis"],
    },
    ports: {
      inputs: [
        {
          id: "stateOrder",
          label: "State Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "editionOrder",
          label: "Edition Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "orderBasis",
          label: "Order Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "key",
          label: "Key",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "basis", label: "Basis", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = artworkStateEditionOrderTokenTool.execute;
export default artworkStateEditionOrderTokenTool;
