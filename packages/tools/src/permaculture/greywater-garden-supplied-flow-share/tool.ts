import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalObservedFlow: number;
  readonly allocatedFraction: number;
  readonly excludedVolume: number;
};
export type Output = {
  readonly allocatedVolume: number;
  readonly netRecordedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalObservedFlow: { type: "number", minimum: 0 },
    allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
    excludedVolume: { type: "number", minimum: 0 },
  },
  required: ["totalObservedFlow", "allocatedFraction", "excludedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedVolume: { type: "number" },
    netRecordedVolume: { type: "number" },
  },
  required: ["allocatedVolume", "netRecordedVolume"],
} as const;
/** Supplied water-allocation accounting without reuse-suitability advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalObservedFlow, allocatedFraction, excludedVolume } = request;
  const compute = (): Output => {
    H.domain(totalObservedFlow >= 0 && excludedVolume >= 0);
    H.probability(allocatedFraction);
    return {
      allocatedVolume: totalObservedFlow * allocatedFraction,
      netRecordedVolume: totalObservedFlow * allocatedFraction - excludedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalObservedFlow: 100, allocatedFraction: 0.6, excludedVolume: 10 },
  output: { allocatedVolume: 60, netRecordedVolume: 50 },
} satisfies ToolExample<Input, Output>;
export const greywaterGardenSuppliedFlowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/greywater-garden-supplied-flow-share",
    title: "Greywater Garden Supplied Flow Share Tool",
    description:
      "Supplied water-allocation accounting without reuse-suitability advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalObservedFlow: { type: "number", minimum: 0 },
        allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
        excludedVolume: { type: "number", minimum: 0 },
      },
      required: ["totalObservedFlow", "allocatedFraction", "excludedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedVolume: { type: "number" },
        netRecordedVolume: { type: "number" },
      },
      required: ["allocatedVolume", "netRecordedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "totalObservedFlow",
          label: "Total Observed Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedFraction",
          label: "Allocated Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedVolume",
          label: "Allocated Volume",
          valueType: { type: "number" },
        },
        {
          id: "netRecordedVolume",
          label: "Net Recorded Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = greywaterGardenSuppliedFlowShareTool.execute;
export default greywaterGardenSuppliedFlowShareTool;
