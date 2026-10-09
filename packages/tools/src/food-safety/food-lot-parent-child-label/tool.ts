import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentLotId: string;
  readonly childLotId: string;
  readonly transformationRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentLotId: { type: "string", maxLength: 8192, minLength: 1 },
    childLotId: { type: "string", maxLength: 8192, minLength: 1 },
    transformationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["parentLotId", "childLotId", "transformationRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit food-lot parent-child relationship by transformation record without inferring traceability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentLotId, childLotId, transformationRecordId } = request;
  const compute = (): Output => {
    H.domain(parentLotId.length > 0, "parentLotId");
    H.domain(childLotId.length > 0, "childLotId");
    H.domain(transformationRecordId.length > 0, "transformationRecordId");
    return {
      token: JSON.stringify([parentLotId, childLotId, transformationRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentLotId: "LOT17",
    childLotId: "CHILD2",
    transformationRecordId: "TR2",
  },
  output: { token: '["LOT17","CHILD2","TR2"]' },
} satisfies ToolExample<Input, Output>;
export const foodLotParentChildLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/food-lot-parent-child-label",
    title: "Food Lot Parent Child Label",
    description:
      "Qualify an explicit food-lot parent-child relationship by transformation record without inferring traceability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentLotId: { type: "string", maxLength: 8192, minLength: 1 },
        childLotId: { type: "string", maxLength: 8192, minLength: 1 },
        transformationRecordId: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["parentLotId", "childLotId", "transformationRecordId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "parentLotId",
          label: "Parent Lot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "childLotId",
          label: "Child Lot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "transformationRecordId",
          label: "Transformation Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = foodLotParentChildLabelTool.execute;
export default foodLotParentChildLabelTool;
