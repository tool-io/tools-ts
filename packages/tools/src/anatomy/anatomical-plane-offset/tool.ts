import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly planeCoordinate: number;
  readonly positiveNormal: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    planeCoordinate: { type: "number" },
    positiveNormal: { type: "integer" },
  },
  required: ["coordinate", "planeCoordinate", "positiveNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Compare one supplied coordinate with an axis-aligned research plane under an explicit normal sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, planeCoordinate, positiveNormal } = request;
  const compute = (): Output => {
    H.domain(positiveNormal === 1 || positiveNormal === -1);
    return { offset: (coordinate - planeCoordinate) * positiveNormal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 12, planeCoordinate: 10, positiveNormal: 1 },
  output: { offset: 2 },
} satisfies ToolExample<Input, Output>;
export const anatomicalPlaneOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/anatomical-plane-offset",
    title: "Anatomical Plane Offset Tool",
    description:
      "Compare one supplied coordinate with an axis-aligned research plane under an explicit normal sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        planeCoordinate: { type: "number" },
        positiveNormal: { type: "integer" },
      },
      required: ["coordinate", "planeCoordinate", "positiveNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
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
          id: "planeCoordinate",
          label: "Plane Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveNormal",
          label: "Positive Normal",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = anatomicalPlaneOffsetTool.execute;
export default anatomicalPlaneOffsetTool;
