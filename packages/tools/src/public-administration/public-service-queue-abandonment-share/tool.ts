import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly joined: number;
  readonly served: number;
  readonly abandoned: number;
};
export type Output = {
  readonly stillWaiting: number;
  readonly abandonmentFraction: number;
  readonly completedAbandonmentFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    joined: { type: "integer", minimum: 1 },
    served: { type: "integer", minimum: 0 },
    abandoned: { type: "integer", minimum: 0 },
  },
  required: ["joined", "served", "abandoned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stillWaiting: { type: "integer" },
    abandonmentFraction: { type: "number" },
    completedAbandonmentFraction: { type: "number" },
  },
  required: [
    "stillWaiting",
    "abandonmentFraction",
    "completedAbandonmentFraction",
  ],
} as const;
/** Calculate public service queue abandonment share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { joined, served, abandoned } = request;
  const compute = (): Output => {
    H.integer(joined, 1);
    H.integer(served, 0, joined);
    H.integer(abandoned, 0, joined - served);
    H.domain(served + abandoned > 0);
    return {
      stillWaiting: joined - served - abandoned,
      abandonmentFraction: abandoned / joined,
      completedAbandonmentFraction: abandoned / (served + abandoned),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { joined: 100, served: 70, abandoned: 10 },
  output: {
    stillWaiting: 20,
    abandonmentFraction: 0.1,
    completedAbandonmentFraction: 0.125,
  },
} satisfies ToolExample<Input, Output>;
export const publicServiceQueueAbandonmentShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/public-service-queue-abandonment-share",
    title: "Public Service Queue Abandonment Share Tool",
    description:
      "Calculate public service queue abandonment share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        joined: { type: "integer", minimum: 1 },
        served: { type: "integer", minimum: 0 },
        abandoned: { type: "integer", minimum: 0 },
      },
      required: ["joined", "served", "abandoned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stillWaiting: { type: "integer" },
        abandonmentFraction: { type: "number" },
        completedAbandonmentFraction: { type: "number" },
      },
      required: [
        "stillWaiting",
        "abandonmentFraction",
        "completedAbandonmentFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "joined",
          label: "Joined",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "served",
          label: "Served",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "abandoned",
          label: "Abandoned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "stillWaiting",
          label: "Still Waiting",
          valueType: { type: "integer" },
        },
        {
          id: "abandonmentFraction",
          label: "Abandonment Fraction",
          valueType: { type: "number" },
        },
        {
          id: "completedAbandonmentFraction",
          label: "Completed Abandonment Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicServiceQueueAbandonmentShareTool.execute;
export default publicServiceQueueAbandonmentShareTool;
