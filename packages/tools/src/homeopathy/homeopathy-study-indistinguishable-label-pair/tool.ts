import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFields: readonly string[];
  readonly secondFields: readonly string[];
  readonly ignoredIndices: readonly number[];
};
export type Output = {
  readonly sameVisible: boolean;
  readonly differingVisible: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ignoredIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["firstFields", "secondFields", "ignoredIndices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameVisible: { type: "boolean" },
    differingVisible: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["sameVisible", "differingVisible"],
} as const;
/** Compare supplied label fields after explicit masking, without evaluating clinical blinding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFields, secondFields, ignoredIndices } = request;
  const compute = (): Output => {
    H.sameLength(firstFields, secondFields);
    H.domain(ignoredIndices.every((x) => x >= 0 && x < firstFields.length));
    const differingVisible = firstFields.flatMap((x, i) =>
      !ignoredIndices.includes(i) && x !== secondFields[i] ? [i] : [],
    );
    return { sameVisible: differingVisible.length === 0, differingVisible };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstFields: ["A", "batch1", "blue"],
    secondFields: ["A", "batch2", "blue"],
    ignoredIndices: [1],
  },
  output: { sameVisible: true, differingVisible: [] },
} satisfies ToolExample<Input, Output>;
export const homeopathyStudyIndistinguishableLabelPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-study-indistinguishable-label-pair",
      title: "Homeopathy Study Indistinguishable Label Pair Tool",
      description:
        "Compare supplied label fields after explicit masking, without evaluating clinical blinding.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          secondFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          ignoredIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["firstFields", "secondFields", "ignoredIndices"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameVisible: { type: "boolean" },
          differingVisible: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["sameVisible", "differingVisible"],
      },
      ports: {
        inputs: [
          {
            id: "firstFields",
            label: "First Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "secondFields",
            label: "Second Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "ignoredIndices",
            label: "Ignored Indices",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "sameVisible",
            label: "Same Visible",
            valueType: { type: "boolean" },
          },
          {
            id: "differingVisible",
            label: "Differing Visible",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyStudyIndistinguishableLabelPairTool.execute;
export default homeopathyStudyIndistinguishableLabelPairTool;
