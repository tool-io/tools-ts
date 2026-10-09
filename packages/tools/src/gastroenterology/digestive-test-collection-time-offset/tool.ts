import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionTimestampSeconds: number;
  readonly referenceTimestampSeconds: number;
};
export type Output = { readonly relativeSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionTimestampSeconds: { type: "number" },
    referenceTimestampSeconds: { type: "number" },
  },
  required: ["collectionTimestampSeconds", "referenceTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeSeconds: { type: "number" } },
  required: ["relativeSeconds"],
} as const;
/** Express a supplied collection time relative to an explicit digestive-test anchor without interpreting a test result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionTimestampSeconds, referenceTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      relativeSeconds: collectionTimestampSeconds - referenceTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionTimestampSeconds: 750, referenceTimestampSeconds: 600 },
  output: { relativeSeconds: 150 },
} satisfies ToolExample<Input, Output>;
export const digestiveTestCollectionTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/digestive-test-collection-time-offset",
    title: "Digestive Test Collection Time Offset",
    description:
      "Express a supplied collection time relative to an explicit digestive-test anchor without interpreting a test result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionTimestampSeconds: { type: "number" },
        referenceTimestampSeconds: { type: "number" },
      },
      required: ["collectionTimestampSeconds", "referenceTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeSeconds: { type: "number" } },
      required: ["relativeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "collectionTimestampSeconds",
          label: "Collection Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTimestampSeconds",
          label: "Reference Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeSeconds",
          label: "Relative Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = digestiveTestCollectionTimeOffsetTool.execute;
export default digestiveTestCollectionTimeOffsetTool;
