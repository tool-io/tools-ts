import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitude: number;
  readonly south: number;
  readonly north: number;
  readonly includeSouth: boolean;
  readonly includeNorth: boolean;
};
export type Output = { readonly inside: boolean; readonly pole: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitude: { type: "number", minimum: -90, maximum: 90 },
    south: { type: "number", minimum: -90 },
    north: { type: "number", maximum: 90 },
    includeSouth: { type: "boolean" },
    includeNorth: { type: "boolean" },
  },
  required: ["latitude", "south", "north", "includeSouth", "includeNorth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" }, pole: { type: "boolean" } },
  required: ["inside", "pole"],
} as const;
/** Calculate latitude band open pole membership from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { latitude, south, north, includeSouth, includeNorth } = input;
  const compute = (): Output => {
    H.domain(
      latitude >= -90 &&
        latitude <= 90 &&
        south >= -90 &&
        south < north &&
        north <= 90,
    );
    return {
      inside:
        (includeSouth ? latitude >= south : latitude > south) &&
        (includeNorth ? latitude <= north : latitude < north),
      pole: Math.abs(latitude) === 90,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    latitude: 90,
    south: 80,
    north: 90,
    includeSouth: true,
    includeNorth: false,
  },
  output: { inside: false, pole: true },
} satisfies ToolExample<Input, Output>;
export const latitudeBandOpenPoleMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/latitude-band-open-pole-membership",
    title: "Latitude Band Open Pole Membership Tool",
    description:
      "Calculate latitude band open pole membership from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitude: { type: "number", minimum: -90, maximum: 90 },
        south: { type: "number", minimum: -90 },
        north: { type: "number", maximum: 90 },
        includeSouth: { type: "boolean" },
        includeNorth: { type: "boolean" },
      },
      required: ["latitude", "south", "north", "includeSouth", "includeNorth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inside: { type: "boolean" }, pole: { type: "boolean" } },
      required: ["inside", "pole"],
    },
    ports: {
      inputs: [
        {
          id: "latitude",
          label: "Latitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "south",
          label: "South",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "north",
          label: "North",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeSouth",
          label: "Include South",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeNorth",
          label: "Include North",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        { id: "pole", label: "Pole", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = latitudeBandOpenPoleMembershipTool.execute;
export default latitudeBandOpenPoleMembershipTool;
