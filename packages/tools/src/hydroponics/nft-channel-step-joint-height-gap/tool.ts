import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upstreamElevation: number;
  readonly downstreamElevation: number;
  readonly jointLipHeight: number;
  readonly suppliedAllowedStep: number;
};
export type Output = {
  readonly effectiveStep: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstreamElevation: { type: "number" },
    downstreamElevation: { type: "number" },
    jointLipHeight: { type: "number", minimum: 0 },
    suppliedAllowedStep: { type: "number" },
  },
  required: [
    "upstreamElevation",
    "downstreamElevation",
    "jointLipHeight",
    "suppliedAllowedStep",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveStep: { type: "number" }, margin: { type: "number" } },
  required: ["effectiveStep", "margin"],
} as const;
/** Compare supplied bench channel-joint elevations to an independent step allowance; no flow or system suitability guarantee. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    upstreamElevation,
    downstreamElevation,
    jointLipHeight,
    suppliedAllowedStep,
  } = request;
  const compute = (): Output => {
    H.domain(jointLipHeight >= 0);
    return {
      effectiveStep: downstreamElevation + jointLipHeight - upstreamElevation,
      margin:
        suppliedAllowedStep -
        (downstreamElevation + jointLipHeight - upstreamElevation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    upstreamElevation: 10,
    downstreamElevation: 9,
    jointLipHeight: 2,
    suppliedAllowedStep: 2,
  },
  output: { effectiveStep: 1, margin: 1 },
} satisfies ToolExample<Input, Output>;
export const nftChannelStepJointHeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/nft-channel-step-joint-height-gap",
    title: "NFT Channel Step Joint Height Gap Tool",
    description:
      "Compare supplied bench channel-joint elevations to an independent step allowance; no flow or system suitability guarantee.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upstreamElevation: { type: "number" },
        downstreamElevation: { type: "number" },
        jointLipHeight: { type: "number", minimum: 0 },
        suppliedAllowedStep: { type: "number" },
      },
      required: [
        "upstreamElevation",
        "downstreamElevation",
        "jointLipHeight",
        "suppliedAllowedStep",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveStep: { type: "number" },
        margin: { type: "number" },
      },
      required: ["effectiveStep", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "upstreamElevation",
          label: "Upstream Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downstreamElevation",
          label: "Downstream Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "jointLipHeight",
          label: "Joint Lip Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAllowedStep",
          label: "Supplied Allowed Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveStep",
          label: "Effective Step",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nftChannelStepJointHeightGapTool.execute;
export default nftChannelStepJointHeightGapTool;
