import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedEditions: readonly string[];
  readonly acknowledgedEdition: string;
};
export type Output = {
  readonly known: boolean;
  readonly latestEdition: string;
  readonly distanceFromLatest: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedEditions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    acknowledgedEdition: { type: "string", maxLength: 8192 },
  },
  required: ["orderedEditions", "acknowledgedEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    latestEdition: { type: "string", maxLength: 8192 },
    distanceFromLatest: { type: "integer" },
  },
  required: ["known", "latestEdition", "distanceFromLatest"],
} as const;
/** Compare an acknowledgement to an explicit edition order without inferring approval or training adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedEditions, acknowledgedEdition } = request;
  const compute = (): Output => {
    H.domain(
      orderedEditions.length > 0 &&
        new Set(orderedEditions).size === orderedEditions.length,
    );
    const i = orderedEditions.indexOf(acknowledgedEdition);
    return {
      known: i >= 0,
      latestEdition: orderedEditions[orderedEditions.length - 1],
      distanceFromLatest: i >= 0 ? orderedEditions.length - 1 - i : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderedEditions: ["v1", "v2", "v3"], acknowledgedEdition: "v1" },
  output: { known: true, latestEdition: "v3", distanceFromLatest: 2 },
} satisfies ToolExample<Input, Output>;
export const trainingAcknowledgementLatestVersionRankTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/training-acknowledgement-latest-version-rank",
      title: "Training Acknowledgement Latest Version Rank Tool",
      description:
        "Compare an acknowledgement to an explicit edition order without inferring approval or training adequacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          orderedEditions: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          acknowledgedEdition: { type: "string", maxLength: 8192 },
        },
        required: ["orderedEditions", "acknowledgedEdition"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          known: { type: "boolean" },
          latestEdition: { type: "string", maxLength: 8192 },
          distanceFromLatest: { type: "integer" },
        },
        required: ["known", "latestEdition", "distanceFromLatest"],
      },
      ports: {
        inputs: [
          {
            id: "orderedEditions",
            label: "Ordered Editions",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "acknowledgedEdition",
            label: "Acknowledged Edition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "known", label: "Known", valueType: { type: "boolean" } },
          {
            id: "latestEdition",
            label: "Latest Edition",
            valueType: { type: "string" },
          },
          {
            id: "distanceFromLatest",
            label: "Distance From Latest",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trainingAcknowledgementLatestVersionRankTool.execute;
export default trainingAcknowledgementLatestVersionRankTool;
