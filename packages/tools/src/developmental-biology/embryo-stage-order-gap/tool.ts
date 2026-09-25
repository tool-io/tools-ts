import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStage: string;
  readonly secondStage: string;
  readonly suppliedStageOrder: readonly string[];
};
export type Output = { readonly indexGap: number; readonly sameStage: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStage: { type: "string", maxLength: 8192 },
    secondStage: { type: "string", maxLength: 8192 },
    suppliedStageOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstStage", "secondStage", "suppliedStageOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { indexGap: { type: "integer" }, sameStage: { type: "boolean" } },
  required: ["indexGap", "sameStage"],
} as const;
/** Compare supplied research stage labels against a caller-specified ordering without species-specific staging inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStage, secondStage, suppliedStageOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedStageOrder).size === suppliedStageOrder.length);
    const a = suppliedStageOrder.indexOf(firstStage),
      b = suppliedStageOrder.indexOf(secondStage);
    H.domain(a >= 0 && b >= 0);
    return { indexGap: b - a, sameStage: a === b };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStage: "stage-A",
    secondStage: "stage-C",
    suppliedStageOrder: ["stage-A", "stage-B", "stage-C"],
  },
  output: { indexGap: 2, sameStage: false },
} satisfies ToolExample<Input, Output>;
export const embryoStageOrderGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "developmental-biology/embryo-stage-order-gap",
      title: "Embryo Stage Order Gap Tool",
      description:
        "Compare supplied research stage labels against a caller-specified ordering without species-specific staging inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstStage: { type: "string", maxLength: 8192 },
          secondStage: { type: "string", maxLength: 8192 },
          suppliedStageOrder: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["firstStage", "secondStage", "suppliedStageOrder"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indexGap: { type: "integer" },
          sameStage: { type: "boolean" },
        },
        required: ["indexGap", "sameStage"],
      },
      ports: {
        inputs: [
          {
            id: "firstStage",
            label: "First Stage",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondStage",
            label: "Second Stage",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedStageOrder",
            label: "Supplied Stage Order",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "indexGap",
            label: "Index Gap",
            valueType: { type: "integer" },
          },
          {
            id: "sameStage",
            label: "Same Stage",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = embryoStageOrderGapTool.execute;
export default embryoStageOrderGapTool;
