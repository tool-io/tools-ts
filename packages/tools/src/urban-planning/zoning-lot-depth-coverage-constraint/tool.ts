import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotWidth: number;
  readonly lotDepth: number;
  readonly frontSetback: number;
  readonly rearSetback: number;
  readonly maxCoverage: number;
};
export type Output = {
  readonly envelopeFootprint: number;
  readonly coverageFootprint: number;
  readonly constrainedFootprint: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotWidth: { type: "number", minimum: 0 },
    lotDepth: { type: "number" },
    frontSetback: { type: "number", minimum: 0 },
    rearSetback: { type: "number", minimum: 0 },
    maxCoverage: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "lotWidth",
    "lotDepth",
    "frontSetback",
    "rearSetback",
    "maxCoverage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    envelopeFootprint: { type: "number" },
    coverageFootprint: { type: "number" },
    constrainedFootprint: { type: "number" },
  },
  required: ["envelopeFootprint", "coverageFootprint", "constrainedFootprint"],
} as const;
/** Rectangular lot with front/rear setbacks only and an explicit maximum footprint fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotWidth, lotDepth, frontSetback, rearSetback, maxCoverage } =
    request;
  const compute = (): Output => {
    H.domain(
      lotWidth >= 0 &&
        frontSetback >= 0 &&
        rearSetback >= 0 &&
        lotDepth >= frontSetback + rearSetback,
    );
    H.probability(maxCoverage);
    return {
      envelopeFootprint: lotWidth * (lotDepth - frontSetback - rearSetback),
      coverageFootprint: lotWidth * lotDepth * maxCoverage,
      constrainedFootprint: Math.min(
        lotWidth * (lotDepth - frontSetback - rearSetback),
        lotWidth * lotDepth * maxCoverage,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lotWidth: 20,
    lotDepth: 30,
    frontSetback: 5,
    rearSetback: 5,
    maxCoverage: 0.5,
  },
  output: {
    envelopeFootprint: 400,
    coverageFootprint: 300,
    constrainedFootprint: 300,
  },
} satisfies ToolExample<Input, Output>;
export const zoningLotDepthCoverageConstraintTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/zoning-lot-depth-coverage-constraint",
    title: "Zoning Lot Depth Coverage Constraint Tool",
    description:
      "Rectangular lot with front/rear setbacks only and an explicit maximum footprint fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotWidth: { type: "number", minimum: 0 },
        lotDepth: { type: "number" },
        frontSetback: { type: "number", minimum: 0 },
        rearSetback: { type: "number", minimum: 0 },
        maxCoverage: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "lotWidth",
        "lotDepth",
        "frontSetback",
        "rearSetback",
        "maxCoverage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        envelopeFootprint: { type: "number" },
        coverageFootprint: { type: "number" },
        constrainedFootprint: { type: "number" },
      },
      required: [
        "envelopeFootprint",
        "coverageFootprint",
        "constrainedFootprint",
      ],
    },
    ports: {
      inputs: [
        {
          id: "lotWidth",
          label: "Lot Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lotDepth",
          label: "Lot Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frontSetback",
          label: "Front Setback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rearSetback",
          label: "Rear Setback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maxCoverage",
          label: "Max Coverage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "envelopeFootprint",
          label: "Envelope Footprint",
          valueType: { type: "number" },
        },
        {
          id: "coverageFootprint",
          label: "Coverage Footprint",
          valueType: { type: "number" },
        },
        {
          id: "constrainedFootprint",
          label: "Constrained Footprint",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = zoningLotDepthCoverageConstraintTool.execute;
export default zoningLotDepthCoverageConstraintTool;
