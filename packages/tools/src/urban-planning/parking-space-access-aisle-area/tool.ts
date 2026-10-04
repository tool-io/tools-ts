import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spaceWidth: number;
  readonly spaceLength: number;
  readonly aisleWidth: number;
  readonly spaces: number;
  readonly aisleSharedSides: number;
};
export type Output = {
  readonly spaceArea: number;
  readonly allocatedAisleArea: number;
  readonly totalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spaceWidth: { type: "number", minimum: 0 },
    spaceLength: { type: "number", minimum: 0 },
    aisleWidth: { type: "number", minimum: 0 },
    spaces: { type: "integer", minimum: 0 },
    aisleSharedSides: { type: "integer", minimum: 1, maximum: 2 },
  },
  required: [
    "spaceWidth",
    "spaceLength",
    "aisleWidth",
    "spaces",
    "aisleSharedSides",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spaceArea: { type: "number" },
    allocatedAisleArea: { type: "number" },
    totalArea: { type: "number" },
  },
  required: ["spaceArea", "allocatedAisleArea", "totalArea"],
} as const;
/** Rectangular perpendicular bays and a linear aisle allocation, excluding turning ends. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spaceWidth, spaceLength, aisleWidth, spaces, aisleSharedSides } =
    request;
  const compute = (): Output => {
    H.domain(spaceWidth >= 0 && spaceLength >= 0 && aisleWidth >= 0);
    H.integer(spaces, 0);
    H.integer(aisleSharedSides, 1, 2);
    return {
      spaceArea: spaces * spaceWidth * spaceLength,
      allocatedAisleArea: (spaces * spaceWidth * aisleWidth) / aisleSharedSides,
      totalArea:
        spaces * spaceWidth * (spaceLength + aisleWidth / aisleSharedSides),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spaceWidth: 2.5,
    spaceLength: 5,
    aisleWidth: 6,
    spaces: 10,
    aisleSharedSides: 2,
  },
  output: { spaceArea: 125, allocatedAisleArea: 75, totalArea: 200 },
} satisfies ToolExample<Input, Output>;
export const parkingSpaceAccessAisleAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/parking-space-access-aisle-area",
    title: "Parking Space Access Aisle Area Tool",
    description:
      "Rectangular perpendicular bays and a linear aisle allocation, excluding turning ends.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spaceWidth: { type: "number", minimum: 0 },
        spaceLength: { type: "number", minimum: 0 },
        aisleWidth: { type: "number", minimum: 0 },
        spaces: { type: "integer", minimum: 0 },
        aisleSharedSides: { type: "integer", minimum: 1, maximum: 2 },
      },
      required: [
        "spaceWidth",
        "spaceLength",
        "aisleWidth",
        "spaces",
        "aisleSharedSides",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spaceArea: { type: "number" },
        allocatedAisleArea: { type: "number" },
        totalArea: { type: "number" },
      },
      required: ["spaceArea", "allocatedAisleArea", "totalArea"],
    },
    ports: {
      inputs: [
        {
          id: "spaceWidth",
          label: "Space Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spaceLength",
          label: "Space Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aisleWidth",
          label: "Aisle Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spaces",
          label: "Spaces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "aisleSharedSides",
          label: "Aisle Shared Sides",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "spaceArea", label: "Space Area", valueType: { type: "number" } },
        {
          id: "allocatedAisleArea",
          label: "Allocated Aisle Area",
          valueType: { type: "number" },
        },
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parkingSpaceAccessAisleAreaTool.execute;
export default parkingSpaceAccessAisleAreaTool;
