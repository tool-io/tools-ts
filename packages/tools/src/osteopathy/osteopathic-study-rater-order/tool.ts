import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly raterIds: readonly string[];
  readonly zeroBasedOrder: readonly number[];
};
export type Output = { readonly orderedRaterIds: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    raterIds: {
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
  required: ["raterIds", "zeroBasedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedRaterIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["orderedRaterIds"],
} as const;
/** Apply an explicit permutation to study rater identifiers without randomizing or inferring rater assignments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { raterIds, zeroBasedOrder } = request;
  const compute = (): Output => {
    H.domain(raterIds.length === zeroBasedOrder.length, "zeroBasedOrder");
    H.domain(
      new Set(zeroBasedOrder).size === raterIds.length,
      "zeroBasedOrder",
    );
    zeroBasedOrder.forEach(
      (index) => (
        H.domain(
          Number.isSafeInteger(index) &&
            index >= 0 &&
            index <= raterIds.length - 1,
          "zeroBasedOrder",
        ),
        index
      ),
    );
    return { orderedRaterIds: zeroBasedOrder.map((index) => raterIds[index]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { raterIds: ["R-A", "R-B", "R-C"], zeroBasedOrder: [2, 0, 1] },
  output: { orderedRaterIds: ["R-C", "R-A", "R-B"] },
} satisfies ToolExample<Input, Output>;
export const osteopathicStudyRaterOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathic-study-rater-order",
    title: "Osteopathic Study Rater Order",
    description:
      "Apply an explicit permutation to study rater identifiers without randomizing or inferring rater assignments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        raterIds: {
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
      required: ["raterIds", "zeroBasedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedRaterIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["orderedRaterIds"],
    },
    ports: {
      inputs: [
        {
          id: "raterIds",
          label: "Rater Ids",
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
          id: "orderedRaterIds",
          label: "Ordered Rater Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = osteopathicStudyRaterOrderTool.execute;
export default osteopathicStudyRaterOrderTool;
