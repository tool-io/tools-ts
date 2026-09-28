import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longitude: number;
  readonly west: number;
  readonly east: number;
};
export type Output = {
  readonly inside: boolean;
  readonly crossesAntimeridian: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitude: { type: "number", minimum: -180, exclusiveMaximum: 180 },
    west: { type: "number", minimum: -180, exclusiveMaximum: 180 },
    east: { type: "number", minimum: -180, exclusiveMaximum: 180 },
  },
  required: ["longitude", "west", "east"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inside: { type: "boolean" },
    crossesAntimeridian: { type: "boolean" },
  },
  required: ["inside", "crossesAntimeridian"],
} as const;
/** Calculate longitude cell half open membership from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { longitude, west, east } = input;
  const compute = (): Output => {
    H.domain(
      longitude >= -180 &&
        longitude < 180 &&
        west >= -180 &&
        west < 180 &&
        east >= -180 &&
        east < 180,
    );
    const crossesAntimeridian = west > east;
    return {
      inside:
        west === east
          ? false
          : crossesAntimeridian
            ? longitude >= west || longitude < east
            : longitude >= west && longitude < east,
      crossesAntimeridian,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { longitude: 179, west: 170, east: -170 },
  output: { inside: true, crossesAntimeridian: true },
} satisfies ToolExample<Input, Output>;
export const longitudeCellHalfOpenMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/longitude-cell-half-open-membership",
    title: "Longitude Cell Half Open Membership Tool",
    description:
      "Calculate longitude cell half open membership from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longitude: { type: "number", minimum: -180, exclusiveMaximum: 180 },
        west: { type: "number", minimum: -180, exclusiveMaximum: 180 },
        east: { type: "number", minimum: -180, exclusiveMaximum: 180 },
      },
      required: ["longitude", "west", "east"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inside: { type: "boolean" },
        crossesAntimeridian: { type: "boolean" },
      },
      required: ["inside", "crossesAntimeridian"],
    },
    ports: {
      inputs: [
        {
          id: "longitude",
          label: "Longitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "west",
          label: "West",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "east",
          label: "East",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        {
          id: "crossesAntimeridian",
          label: "Crosses Antimeridian",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = longitudeCellHalfOpenMembershipTool.execute;
export default longitudeCellHalfOpenMembershipTool;
