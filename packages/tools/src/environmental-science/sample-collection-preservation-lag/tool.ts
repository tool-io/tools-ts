import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionTimestampSeconds: number;
  readonly preservationTimestampSeconds: number;
};
export type Output = { readonly lagSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionTimestampSeconds: { type: "number" },
    preservationTimestampSeconds: { type: "number" },
  },
  required: ["collectionTimestampSeconds", "preservationTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lagSeconds: { type: "number" } },
  required: ["lagSeconds"],
} as const;
/** Record an ordered sample collection-to-preservation interval on a shared timeline without assigning holding-time compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionTimestampSeconds, preservationTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      preservationTimestampSeconds >= collectionTimestampSeconds,
      "preservationTimestampSeconds",
    );
    return {
      lagSeconds: preservationTimestampSeconds - collectionTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionTimestampSeconds: 1000,
    preservationTimestampSeconds: 1360,
  },
  output: { lagSeconds: 360 },
} satisfies ToolExample<Input, Output>;
export const sampleCollectionPreservationLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/sample-collection-preservation-lag",
    title: "Sample Collection Preservation Lag Tool",
    description:
      "Record an ordered sample collection-to-preservation interval on a shared timeline without assigning holding-time compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionTimestampSeconds: { type: "number" },
        preservationTimestampSeconds: { type: "number" },
      },
      required: ["collectionTimestampSeconds", "preservationTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lagSeconds: { type: "number" } },
      required: ["lagSeconds"],
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
          id: "preservationTimestampSeconds",
          label: "Preservation Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lagSeconds",
          label: "Lag Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleCollectionPreservationLagTool.execute;
export default sampleCollectionPreservationLagTool;
