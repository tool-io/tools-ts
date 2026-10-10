import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crownRadius: number;
  readonly suppliedHorizontalShadowOffset: number;
};
export type Output = {
  readonly minimumAxisCoordinate: number;
  readonly maximumAxisCoordinate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crownRadius: { type: "number", minimum: 0 },
    suppliedHorizontalShadowOffset: { type: "number" },
  },
  required: ["crownRadius", "suppliedHorizontalShadowOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumAxisCoordinate: { type: "number" },
    maximumAxisCoordinate: { type: "number" },
  },
  required: ["minimumAxisCoordinate", "maximumAxisCoordinate"],
} as const;
/** Offset an explicit circular-crown radius along a supplied ground-shadow axis without predicting solar position or crown shape. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crownRadius, suppliedHorizontalShadowOffset } = request;
  const compute = (): Output => {
    H.domain(crownRadius >= 0, "crownRadius");
    return {
      minimumAxisCoordinate: suppliedHorizontalShadowOffset - crownRadius,
      maximumAxisCoordinate: suppliedHorizontalShadowOffset + crownRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { crownRadius: 3, suppliedHorizontalShadowOffset: 2 },
  output: { minimumAxisCoordinate: -1, maximumAxisCoordinate: 5 },
} satisfies ToolExample<Input, Output>;
export const treeCrownGroundShadeRadiusInputsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/tree-crown-ground-shade-radius-inputs",
    title: "Tree Crown Ground Shade Radius Inputs",
    description:
      "Offset an explicit circular-crown radius along a supplied ground-shadow axis without predicting solar position or crown shape.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crownRadius: { type: "number", minimum: 0 },
        suppliedHorizontalShadowOffset: { type: "number" },
      },
      required: ["crownRadius", "suppliedHorizontalShadowOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumAxisCoordinate: { type: "number" },
        maximumAxisCoordinate: { type: "number" },
      },
      required: ["minimumAxisCoordinate", "maximumAxisCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "crownRadius",
          label: "Crown Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHorizontalShadowOffset",
          label: "Supplied Horizontal Shadow Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumAxisCoordinate",
          label: "Minimum Axis Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "maximumAxisCoordinate",
          label: "Maximum Axis Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeCrownGroundShadeRadiusInputsTool.execute;
export default treeCrownGroundShadeRadiusInputsTool;
