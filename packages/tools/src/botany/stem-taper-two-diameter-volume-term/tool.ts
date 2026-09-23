import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerDiameter: number;
  readonly upperDiameter: number;
  readonly length: number;
  readonly barkThickness: number;
};
export type Output = {
  readonly outerVolume: number;
  readonly innerVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerDiameter: { type: "number", minimum: 0 },
    upperDiameter: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
    barkThickness: { type: "number", minimum: 0 },
  },
  required: ["lowerDiameter", "upperDiameter", "length", "barkThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerVolume: { type: "number" },
    innerVolume: { type: "number" },
  },
  required: ["outerVolume", "innerVolume"],
} as const;
/** Conical-frustum stem volume with an explicit uniform radial bark thickness; not a fitted whole-tree volume equation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerDiameter, upperDiameter, length, barkThickness } = request;
  const compute = (): Output => {
    H.domain(
      lowerDiameter >= 0 &&
        upperDiameter >= 0 &&
        length >= 0 &&
        barkThickness >= 0 &&
        2 * barkThickness <= Math.min(lowerDiameter, upperDiameter),
    );
    return {
      outerVolume:
        (Math.PI *
          length *
          (lowerDiameter ** 2 +
            lowerDiameter * upperDiameter +
            upperDiameter ** 2)) /
        12,
      innerVolume:
        (Math.PI *
          length *
          ((lowerDiameter - 2 * barkThickness) ** 2 +
            (lowerDiameter - 2 * barkThickness) *
              (upperDiameter - 2 * barkThickness) +
            (upperDiameter - 2 * barkThickness) ** 2)) /
        12,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerDiameter: 4, upperDiameter: 2, length: 3, barkThickness: 0 },
  output: { outerVolume: 21.991148575128552, innerVolume: 21.991148575128552 },
} satisfies ToolExample<Input, Output>;
export const stemTaperTwoDiameterVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/stem-taper-two-diameter-volume-term",
    title: "Stem Taper Two Diameter Volume Term Tool",
    description:
      "Conical-frustum stem volume with an explicit uniform radial bark thickness; not a fitted whole-tree volume equation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerDiameter: { type: "number", minimum: 0 },
        upperDiameter: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
        barkThickness: { type: "number", minimum: 0 },
      },
      required: ["lowerDiameter", "upperDiameter", "length", "barkThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerVolume: { type: "number" },
        innerVolume: { type: "number" },
      },
      required: ["outerVolume", "innerVolume"],
    },
    ports: {
      inputs: [
        {
          id: "lowerDiameter",
          label: "Lower Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperDiameter",
          label: "Upper Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "barkThickness",
          label: "Bark Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outerVolume",
          label: "Outer Volume",
          valueType: { type: "number" },
        },
        {
          id: "innerVolume",
          label: "Inner Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stemTaperTwoDiameterVolumeTermTool.execute;
export default stemTaperTwoDiameterVolumeTermTool;
