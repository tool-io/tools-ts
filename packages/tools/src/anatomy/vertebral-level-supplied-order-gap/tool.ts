import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIndex: number;
  readonly secondIndex: number;
  readonly indexIncreasesInferiorly: boolean;
};
export type Output = {
  readonly signedIndexGap: number;
  readonly inferiorSteps: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "integer", minimum: 0 },
    secondIndex: { type: "integer", minimum: 0 },
    indexIncreasesInferiorly: { type: "boolean" },
  },
  required: ["firstIndex", "secondIndex", "indexIncreasesInferiorly"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedIndexGap: { type: "integer" },
    inferiorSteps: { type: "integer" },
  },
  required: ["signedIndexGap", "inferiorSteps"],
} as const;
/** Distance in an explicitly supplied ordered level index; no vertebral numbering table or anatomical variant is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIndex, secondIndex, indexIncreasesInferiorly } = request;
  const compute = (): Output => {
    H.integer(firstIndex, 0);
    H.integer(secondIndex, 0);
    return {
      signedIndexGap: secondIndex - firstIndex,
      inferiorSteps:
        (secondIndex - firstIndex) * (indexIncreasesInferiorly ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstIndex: 3, secondIndex: 7, indexIncreasesInferiorly: true },
  output: { signedIndexGap: 4, inferiorSteps: 4 },
} satisfies ToolExample<Input, Output>;
export const vertebralLevelSuppliedOrderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/vertebral-level-supplied-order-gap",
    title: "Vertebral Level Supplied Order Gap Tool",
    description:
      "Distance in an explicitly supplied ordered level index; no vertebral numbering table or anatomical variant is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "integer", minimum: 0 },
        secondIndex: { type: "integer", minimum: 0 },
        indexIncreasesInferiorly: { type: "boolean" },
      },
      required: ["firstIndex", "secondIndex", "indexIncreasesInferiorly"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedIndexGap: { type: "integer" },
        inferiorSteps: { type: "integer" },
      },
      required: ["signedIndexGap", "inferiorSteps"],
    },
    ports: {
      inputs: [
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondIndex",
          label: "Second Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "indexIncreasesInferiorly",
          label: "Index Increases Inferiorly",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedIndexGap",
          label: "Signed Index Gap",
          valueType: { type: "integer" },
        },
        {
          id: "inferiorSteps",
          label: "Inferior Steps",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = vertebralLevelSuppliedOrderGapTool.execute;
export default vertebralLevelSuppliedOrderGapTool;
