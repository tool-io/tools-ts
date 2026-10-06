import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly positiveMeansLeft: boolean;
};
export type Output = {
  readonly leftPositiveCoordinate: number;
  readonly rightPositiveCoordinate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    positiveMeansLeft: { type: "boolean" },
  },
  required: ["coordinate", "positiveMeansLeft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftPositiveCoordinate: { type: "number" },
    rightPositiveCoordinate: { type: "number" },
  },
  required: ["leftPositiveCoordinate", "rightPositiveCoordinate"],
} as const;
/** Crosswalk a supplied left/right coordinate sign under an explicit left-positive or right-positive convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, positiveMeansLeft } = request;
  const compute = (): Output => {
    return {
      leftPositiveCoordinate: positiveMeansLeft ? coordinate : -coordinate,
      rightPositiveCoordinate: positiveMeansLeft ? -coordinate : coordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 5, positiveMeansLeft: true },
  output: { leftPositiveCoordinate: 5, rightPositiveCoordinate: -5 },
} satisfies ToolExample<Input, Output>;
export const sagittalLeftRightSignCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/sagittal-left-right-sign-crosswalk",
    title: "Sagittal Left Right Sign Crosswalk",
    description:
      "Crosswalk a supplied left/right coordinate sign under an explicit left-positive or right-positive convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        positiveMeansLeft: { type: "boolean" },
      },
      required: ["coordinate", "positiveMeansLeft"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftPositiveCoordinate: { type: "number" },
        rightPositiveCoordinate: { type: "number" },
      },
      required: ["leftPositiveCoordinate", "rightPositiveCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansLeft",
          label: "Positive Means Left",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "leftPositiveCoordinate",
          label: "Left Positive Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "rightPositiveCoordinate",
          label: "Right Positive Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sagittalLeftRightSignCrosswalkTool.execute;
export default sagittalLeftRightSignCrosswalkTool;
