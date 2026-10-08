import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canvasIds: readonly string[];
  readonly zeroBasedOrder: readonly number[];
};
export type Output = { readonly orderedCanvasIds: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canvasIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    zeroBasedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["canvasIds", "zeroBasedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedCanvasIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["orderedCanvasIds"],
} as const;
/** Reorder explicit facsimile canvas IDs by a full supplied permutation without inferring physical manuscript page order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canvasIds, zeroBasedOrder } = request;
  const compute = (): Output => {
    H.domain(canvasIds.length === zeroBasedOrder.length, "zeroBasedOrder");
    H.domain(
      new Set(canvasIds).size === canvasIds.length &&
        new Set(zeroBasedOrder).size === zeroBasedOrder.length,
      "canvasIds",
    );
    zeroBasedOrder.forEach(
      (v) => (
        H.domain(
          Number.isSafeInteger(v) && v >= 0 && v <= canvasIds.length - 1,
          "zeroBasedOrder",
        ),
        v
      ),
    );
    return { orderedCanvasIds: zeroBasedOrder.map((i) => canvasIds[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { canvasIds: ["c1", "c2", "c3"], zeroBasedOrder: [2, 0, 1] },
  output: { orderedCanvasIds: ["c3", "c1", "c2"] },
} satisfies ToolExample<Input, Output>;
export const facsimileCanvasPageOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/facsimile-canvas-page-order",
    title: "Facsimile Canvas Page Order",
    description:
      "Reorder explicit facsimile canvas IDs by a full supplied permutation without inferring physical manuscript page order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canvasIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        zeroBasedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["canvasIds", "zeroBasedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedCanvasIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["orderedCanvasIds"],
    },
    ports: {
      inputs: [
        {
          id: "canvasIds",
          label: "Canvas Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "zeroBasedOrder",
          label: "Zero Based Order",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "orderedCanvasIds",
          label: "Ordered Canvas Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = facsimileCanvasPageOrderTool.execute;
export default facsimileCanvasPageOrderTool;
