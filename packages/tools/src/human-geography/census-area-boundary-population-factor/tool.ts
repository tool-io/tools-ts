import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldPopulation: number;
  readonly transferredOut: number;
  readonly transferredIn: number;
  readonly newLandArea: number;
};
export type Output = {
  readonly rebasedPopulation: number;
  readonly newDensity: number;
  readonly netBoundaryChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldPopulation: { type: "number", minimum: 0 },
    transferredOut: { type: "number", minimum: 0 },
    transferredIn: { type: "number", minimum: 0 },
    newLandArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["oldPopulation", "transferredOut", "transferredIn", "newLandArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rebasedPopulation: { type: "number" },
    newDensity: { type: "number" },
    netBoundaryChange: { type: "number" },
  },
  required: ["rebasedPopulation", "newDensity", "netBoundaryChange"],
} as const;
/** Rebase a population inventory using explicit transferred counts, not an area-proportional population assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldPopulation, transferredOut, transferredIn, newLandArea } = request;
  const compute = (): Output => {
    H.domain(
      oldPopulation >= 0 &&
        transferredOut >= 0 &&
        transferredOut <= oldPopulation &&
        transferredIn >= 0,
    );
    H.positive(newLandArea);
    return {
      rebasedPopulation: oldPopulation - transferredOut + transferredIn,
      newDensity:
        (oldPopulation - transferredOut + transferredIn) / newLandArea,
      netBoundaryChange: transferredIn - transferredOut,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldPopulation: 10000,
    transferredOut: 1000,
    transferredIn: 2500,
    newLandArea: 50,
  },
  output: {
    rebasedPopulation: 11500,
    newDensity: 230,
    netBoundaryChange: 1500,
  },
} satisfies ToolExample<Input, Output>;
export const censusAreaBoundaryPopulationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/census-area-boundary-population-factor",
    title: "Census Area Boundary Population Factor Tool",
    description:
      "Rebase a population inventory using explicit transferred counts, not an area-proportional population assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldPopulation: { type: "number", minimum: 0 },
        transferredOut: { type: "number", minimum: 0 },
        transferredIn: { type: "number", minimum: 0 },
        newLandArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "oldPopulation",
        "transferredOut",
        "transferredIn",
        "newLandArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rebasedPopulation: { type: "number" },
        newDensity: { type: "number" },
        netBoundaryChange: { type: "number" },
      },
      required: ["rebasedPopulation", "newDensity", "netBoundaryChange"],
    },
    ports: {
      inputs: [
        {
          id: "oldPopulation",
          label: "Old Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferredOut",
          label: "Transferred Out",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferredIn",
          label: "Transferred In",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newLandArea",
          label: "New Land Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rebasedPopulation",
          label: "Rebased Population",
          valueType: { type: "number" },
        },
        {
          id: "newDensity",
          label: "New Density",
          valueType: { type: "number" },
        },
        {
          id: "netBoundaryChange",
          label: "Net Boundary Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = censusAreaBoundaryPopulationFactorTool.execute;
export default censusAreaBoundaryPopulationFactorTool;
