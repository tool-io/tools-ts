import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chiDownstream: number;
  readonly reachLength: number;
  readonly referenceArea: number;
  readonly drainageArea: number;
  readonly concavity: number;
};
export type Output = {
  readonly increment: number;
  readonly chiUpstream: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chiDownstream: { type: "number" },
    reachLength: { type: "number", minimum: 0 },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
    drainageArea: { type: "number", exclusiveMinimum: 0 },
    concavity: { type: "number" },
  },
  required: [
    "chiDownstream",
    "reachLength",
    "referenceArea",
    "drainageArea",
    "concavity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increment: { type: "number" },
    chiUpstream: { type: "number" },
  },
  required: ["increment", "chiUpstream"],
} as const;
/** Constant-area reach quadrature for chi=integral(A0/A)^theta dx, increasing upstream. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chiDownstream, reachLength, referenceArea, drainageArea, concavity } =
    request;
  const compute = (): Output => {
    H.domain(reachLength >= 0);
    H.positive(referenceArea);
    H.positive(drainageArea);
    return {
      increment: reachLength * (referenceArea / drainageArea) ** concavity,
      chiUpstream:
        chiDownstream +
        reachLength * (referenceArea / drainageArea) ** concavity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chiDownstream: 10,
    reachLength: 100,
    referenceArea: 1,
    drainageArea: 4,
    concavity: 0.5,
  },
  output: { increment: 50, chiUpstream: 60 },
} satisfies ToolExample<Input, Output>;
export const channelChiCoordinateOneReachTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/channel-chi-coordinate-one-reach-term",
    title: "Channel Chi Coordinate One Reach Term Tool",
    description:
      "Constant-area reach quadrature for chi=integral(A0/A)^theta dx, increasing upstream.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chiDownstream: { type: "number" },
        reachLength: { type: "number", minimum: 0 },
        referenceArea: { type: "number", exclusiveMinimum: 0 },
        drainageArea: { type: "number", exclusiveMinimum: 0 },
        concavity: { type: "number" },
      },
      required: [
        "chiDownstream",
        "reachLength",
        "referenceArea",
        "drainageArea",
        "concavity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "number" },
        chiUpstream: { type: "number" },
      },
      required: ["increment", "chiUpstream"],
    },
    ports: {
      inputs: [
        {
          id: "chiDownstream",
          label: "Chi Downstream",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reachLength",
          label: "Reach Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainageArea",
          label: "Drainage Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concavity",
          label: "Concavity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
        {
          id: "chiUpstream",
          label: "Chi Upstream",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelChiCoordinateOneReachTermTool.execute;
export default channelChiCoordinateOneReachTermTool;
