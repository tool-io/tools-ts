import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly settledDepth: number;
  readonly suppliedExpansionFraction: number;
  readonly vesselHeight: number;
  readonly reservedHeadspace: number;
};
export type Output = {
  readonly expandedDepth: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settledDepth: { type: "number", minimum: 0 },
    suppliedExpansionFraction: { type: "number", minimum: 0 },
    vesselHeight: { type: "number", minimum: 0 },
    reservedHeadspace: { type: "number", minimum: 0 },
  },
  required: [
    "settledDepth",
    "suppliedExpansionFraction",
    "vesselHeight",
    "reservedHeadspace",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedDepth: { type: "number" },
    clearance: { type: "number" },
  },
  required: ["expandedDepth", "clearance"],
} as const;
/** Supplied expanded-bed envelope arithmetic; no backwash operating condition is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    settledDepth,
    suppliedExpansionFraction,
    vesselHeight,
    reservedHeadspace,
  } = request;
  const compute = (): Output => {
    H.domain(
      settledDepth >= 0 &&
        suppliedExpansionFraction >= 0 &&
        vesselHeight >= 0 &&
        reservedHeadspace >= 0,
    );
    return {
      expandedDepth: settledDepth * (1 + suppliedExpansionFraction),
      clearance:
        vesselHeight -
        reservedHeadspace -
        settledDepth * (1 + suppliedExpansionFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    settledDepth: 1,
    suppliedExpansionFraction: 0.5,
    vesselHeight: 2,
    reservedHeadspace: 0.2,
  },
  output: { expandedDepth: 1.5, clearance: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const filterBedExpansionClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/filter-bed-expansion-clearance",
    title: "Filter BED Expansion Clearance Tool",
    description:
      "Supplied expanded-bed envelope arithmetic; no backwash operating condition is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        settledDepth: { type: "number", minimum: 0 },
        suppliedExpansionFraction: { type: "number", minimum: 0 },
        vesselHeight: { type: "number", minimum: 0 },
        reservedHeadspace: { type: "number", minimum: 0 },
      },
      required: [
        "settledDepth",
        "suppliedExpansionFraction",
        "vesselHeight",
        "reservedHeadspace",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedDepth: { type: "number" },
        clearance: { type: "number" },
      },
      required: ["expandedDepth", "clearance"],
    },
    ports: {
      inputs: [
        {
          id: "settledDepth",
          label: "Settled Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExpansionFraction",
          label: "Supplied Expansion Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "vesselHeight",
          label: "Vessel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedHeadspace",
          label: "Reserved Headspace",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expandedDepth",
          label: "Expanded Depth",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = filterBedExpansionClearanceTool.execute;
export default filterBedExpansionClearanceTool;
