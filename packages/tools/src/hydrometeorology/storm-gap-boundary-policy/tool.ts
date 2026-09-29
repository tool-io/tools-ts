import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryGap: number;
  readonly suppliedThreshold: number;
  readonly equalitySplits: boolean;
};
export type Output = { readonly splitEvents: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryGap: { type: "number", minimum: 0 },
    suppliedThreshold: { type: "number", minimum: 0 },
    equalitySplits: { type: "boolean" },
  },
  required: ["dryGap", "suppliedThreshold", "equalitySplits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { splitEvents: { type: "boolean" } },
  required: ["splitEvents"],
} as const;
/** Resolve a caller-supplied inter-event dry-gap convention without selecting a storm separation threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryGap, suppliedThreshold, equalitySplits } = request;
  const compute = (): Output => {
    H.domain(dryGap >= 0 && suppliedThreshold >= 0);
    return {
      splitEvents: equalitySplits
        ? dryGap >= suppliedThreshold
        : dryGap > suppliedThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryGap: 6, suppliedThreshold: 6, equalitySplits: true },
  output: { splitEvents: true },
} satisfies ToolExample<Input, Output>;
export const stormGapBoundaryPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/storm-gap-boundary-policy",
    title: "Storm Gap Boundary Policy Tool",
    description:
      "Resolve a caller-supplied inter-event dry-gap convention without selecting a storm separation threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryGap: { type: "number", minimum: 0 },
        suppliedThreshold: { type: "number", minimum: 0 },
        equalitySplits: { type: "boolean" },
      },
      required: ["dryGap", "suppliedThreshold", "equalitySplits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { splitEvents: { type: "boolean" } },
      required: ["splitEvents"],
    },
    ports: {
      inputs: [
        {
          id: "dryGap",
          label: "Dry Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalitySplits",
          label: "Equality Splits",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "splitEvents",
          label: "Split Events",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stormGapBoundaryPolicyTool.execute;
export default stormGapBoundaryPolicyTool;
