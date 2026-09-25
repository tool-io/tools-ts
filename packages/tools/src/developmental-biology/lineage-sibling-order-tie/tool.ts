import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthTimes: readonly number[];
  readonly ids: readonly string[];
  readonly tiePolicy: string;
};
export type Output = {
  readonly orderedIds: readonly string[];
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    ids: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    tiePolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["input", "reverse-input"],
    },
  },
  required: ["birthTimes", "ids", "tiePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    tied: { type: "boolean" },
  },
  required: ["orderedIds", "tied"],
} as const;
/** Order supplied annotated sibling birth times under an explicit exact-tie policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthTimes, ids, tiePolicy } = request;
  const compute = (): Output => {
    H.sameLength(birthTimes, ids);
    H.domain(
      new Set(ids).size === ids.length &&
        ["input", "reverse-input"].includes(tiePolicy),
    );
    const indices = ids
      .map((_, i) => i)
      .sort(
        (a, b) =>
          birthTimes[a] - birthTimes[b] ||
          (tiePolicy === "input" ? a - b : b - a),
      );
    return {
      orderedIds: indices.map((i) => ids[i]),
      tied: new Set(birthTimes).size < birthTimes.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthTimes: [2, 1, 1], ids: ["a", "b", "c"], tiePolicy: "input" },
  output: { orderedIds: ["b", "c", "a"], tied: true },
} satisfies ToolExample<Input, Output>;
export const lineageSiblingOrderTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/lineage-sibling-order-tie",
    title: "Lineage Sibling Order Tie Tool",
    description:
      "Order supplied annotated sibling birth times under an explicit exact-tie policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        ids: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        tiePolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["input", "reverse-input"],
        },
      },
      required: ["birthTimes", "ids", "tiePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        tied: { type: "boolean" },
      },
      required: ["orderedIds", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "birthTimes",
          label: "Birth Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "ids",
          label: "Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "tiePolicy",
          label: "Tie Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "orderedIds",
          label: "Ordered Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = lineageSiblingOrderTieTool.execute;
export default lineageSiblingOrderTieTool;
