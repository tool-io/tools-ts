import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pollenCount: number;
  readonly markerCount: number;
  readonly suppliedMarkerAmount: number;
};
export type Output = {
  readonly defined: boolean;
  readonly estimatedAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pollenCount: { type: "integer", minimum: 0 },
    markerCount: { type: "integer", minimum: 0 },
    suppliedMarkerAmount: { type: "number", minimum: 0 },
  },
  required: ["pollenCount", "markerCount", "suppliedMarkerAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    estimatedAmount: { type: "number" },
  },
  required: ["defined", "estimatedAmount"],
} as const;
/** Marker-ratio arithmetic with explicit zero-marker handling; no identification or recovery calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pollenCount, markerCount, suppliedMarkerAmount } = request;
  const compute = (): Output => {
    H.integer(pollenCount, 0);
    H.integer(markerCount, 0);
    H.domain(suppliedMarkerAmount >= 0);
    return {
      defined: markerCount > 0,
      estimatedAmount:
        markerCount > 0
          ? (pollenCount * suppliedMarkerAmount) / markerCount
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pollenCount: 20, markerCount: 0, suppliedMarkerAmount: 100 },
  output: { defined: false, estimatedAmount: 0 },
} satisfies ToolExample<Input, Output>;
export const pollenCounterMarkerGrainZeroBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/pollen-counter-marker-grain-zero-budget",
    title: "Pollen Counter Marker Grain Zero Budget Tool",
    description:
      "Marker-ratio arithmetic with explicit zero-marker handling; no identification or recovery calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pollenCount: { type: "integer", minimum: 0 },
        markerCount: { type: "integer", minimum: 0 },
        suppliedMarkerAmount: { type: "number", minimum: 0 },
      },
      required: ["pollenCount", "markerCount", "suppliedMarkerAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        estimatedAmount: { type: "number" },
      },
      required: ["defined", "estimatedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "pollenCount",
          label: "Pollen Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "markerCount",
          label: "Marker Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMarkerAmount",
          label: "Supplied Marker Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "estimatedAmount",
          label: "Estimated Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollenCounterMarkerGrainZeroBudgetTool.execute;
export default pollenCounterMarkerGrainZeroBudgetTool;
