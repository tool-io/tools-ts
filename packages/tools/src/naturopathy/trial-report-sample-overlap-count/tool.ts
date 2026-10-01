import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIds: readonly string[];
  readonly secondIds: readonly string[];
};
export type Output = { readonly sharedIds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstIds", "secondIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sharedIds: { type: "integer" } },
  required: ["sharedIds"],
} as const;
/** Count exact deidentified research identifiers shared by two supplied reports. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIds, secondIds } = request;
  const compute = (): Output => {
    return {
      sharedIds: new Set(firstIds.filter((x) => secondIds.includes(x))).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstIds: ["a", "b", "b"], secondIds: ["b", "c"] },
  output: { sharedIds: 1 },
} satisfies ToolExample<Input, Output>;
export const trialReportSampleOverlapCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/trial-report-sample-overlap-count",
    title: "Trial Report Sample Overlap Count Tool",
    description:
      "Count exact deidentified research identifiers shared by two supplied reports.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["firstIds", "secondIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sharedIds: { type: "integer" } },
      required: ["sharedIds"],
    },
    ports: {
      inputs: [
        {
          id: "firstIds",
          label: "First Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondIds",
          label: "Second Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "sharedIds",
          label: "Shared Ids",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialReportSampleOverlapCountTool.execute;
export default trialReportSampleOverlapCountTool;
