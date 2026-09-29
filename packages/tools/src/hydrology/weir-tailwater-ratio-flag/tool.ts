import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upstreamHead: number;
  readonly downstreamHead: number;
  readonly suppliedLimit: number;
};
export type Output = {
  readonly ratio: number;
  readonly aboveSuppliedLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstreamHead: { type: "number", exclusiveMinimum: 0 },
    downstreamHead: { type: "number", minimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["upstreamHead", "downstreamHead", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    aboveSuppliedLimit: { type: "boolean" },
  },
  required: ["ratio", "aboveSuppliedLimit"],
} as const;
/** Compare a common-datum tailwater/head ratio with a supplied limit; no discharge relation is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upstreamHead, downstreamHead, suppliedLimit } = request;
  const compute = (): Output => {
    H.positive(upstreamHead);
    H.domain(downstreamHead >= 0 && suppliedLimit >= 0);
    return {
      ratio: downstreamHead / upstreamHead,
      aboveSuppliedLimit: downstreamHead / upstreamHead > suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upstreamHead: 2, downstreamHead: 1, suppliedLimit: 0.6 },
  output: { ratio: 0.5, aboveSuppliedLimit: false },
} satisfies ToolExample<Input, Output>;
export const weirTailwaterRatioFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/weir-tailwater-ratio-flag",
    title: "Weir Tailwater Ratio Flag Tool",
    description:
      "Compare a common-datum tailwater/head ratio with a supplied limit; no discharge relation is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upstreamHead: { type: "number", exclusiveMinimum: 0 },
        downstreamHead: { type: "number", minimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["upstreamHead", "downstreamHead", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        aboveSuppliedLimit: { type: "boolean" },
      },
      required: ["ratio", "aboveSuppliedLimit"],
    },
    ports: {
      inputs: [
        {
          id: "upstreamHead",
          label: "Upstream Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downstreamHead",
          label: "Downstream Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "aboveSuppliedLimit",
          label: "Above Supplied Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = weirTailwaterRatioFlagTool.execute;
export default weirTailwaterRatioFlagTool;
