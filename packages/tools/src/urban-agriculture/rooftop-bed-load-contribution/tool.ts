import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedArea: number;
  readonly depth: number;
  readonly suppliedWetDensity: number;
  readonly containerMass: number;
  readonly allocatedRoofArea: number;
};
export type Output = {
  readonly mass: number;
  readonly massPerAllocatedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedArea: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    suppliedWetDensity: { type: "number", minimum: 0 },
    containerMass: { type: "number", minimum: 0 },
    allocatedRoofArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "bedArea",
    "depth",
    "suppliedWetDensity",
    "containerMass",
    "allocatedRoofArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number" },
    massPerAllocatedArea: { type: "number" },
  },
  required: ["mass", "massPerAllocatedArea"],
} as const;
/** Supplied roof-bed mass accounting only; does not assess structural capacity or safe roof loading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    bedArea,
    depth,
    suppliedWetDensity,
    containerMass,
    allocatedRoofArea,
  } = request;
  const compute = (): Output => {
    H.positive(allocatedRoofArea);
    H.domain(
      bedArea >= 0 &&
        depth >= 0 &&
        suppliedWetDensity >= 0 &&
        containerMass >= 0,
    );
    return {
      mass: bedArea * depth * suppliedWetDensity + containerMass,
      massPerAllocatedArea:
        (bedArea * depth * suppliedWetDensity + containerMass) /
        allocatedRoofArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bedArea: 2,
    depth: 0.5,
    suppliedWetDensity: 1000,
    containerMass: 20,
    allocatedRoofArea: 10,
  },
  output: { mass: 1020, massPerAllocatedArea: 102 },
} satisfies ToolExample<Input, Output>;
export const rooftopBedLoadContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/rooftop-bed-load-contribution",
    title: "Rooftop BED Load Contribution Tool",
    description:
      "Supplied roof-bed mass accounting only; does not assess structural capacity or safe roof loading.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedArea: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        suppliedWetDensity: { type: "number", minimum: 0 },
        containerMass: { type: "number", minimum: 0 },
        allocatedRoofArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "bedArea",
        "depth",
        "suppliedWetDensity",
        "containerMass",
        "allocatedRoofArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number" },
        massPerAllocatedArea: { type: "number" },
      },
      required: ["mass", "massPerAllocatedArea"],
    },
    ports: {
      inputs: [
        {
          id: "bedArea",
          label: "Bed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWetDensity",
          label: "Supplied Wet Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "containerMass",
          label: "Container Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedRoofArea",
          label: "Allocated Roof Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "mass", label: "Mass", valueType: { type: "number" } },
        {
          id: "massPerAllocatedArea",
          label: "Mass Per Allocated Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rooftopBedLoadContributionTool.execute;
export default rooftopBedLoadContributionTool;
