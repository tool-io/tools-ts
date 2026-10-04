import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly outerDepth: number;
  readonly wall: number;
};
export type Output = {
  readonly materialVolume: number;
  readonly cavityVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerWidth: { type: "number" },
    outerHeight: { type: "number" },
    outerDepth: { type: "number" },
    wall: { type: "number", minimum: 0 },
  },
  required: ["outerWidth", "outerHeight", "outerDepth", "wall"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    materialVolume: { type: "number" },
    cavityVolume: { type: "number" },
  },
  required: ["materialVolume", "cavityVolume"],
} as const;
/** Closed rectangular shell with uniform inward wall thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerWidth, outerHeight, outerDepth, wall } = request;
  const compute = (): Output => {
    H.domain(
      wall >= 0 &&
        outerWidth >= 2 * wall &&
        outerHeight >= 2 * wall &&
        outerDepth >= 2 * wall,
    );
    return {
      materialVolume:
        outerWidth * outerHeight * outerDepth -
        (outerWidth - 2 * wall) *
          (outerHeight - 2 * wall) *
          (outerDepth - 2 * wall),
      cavityVolume:
        (outerWidth - 2 * wall) *
        (outerHeight - 2 * wall) *
        (outerDepth - 2 * wall),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerWidth: 10, outerHeight: 10, outerDepth: 10, wall: 1 },
  output: { materialVolume: 488, cavityVolume: 512 },
} satisfies ToolExample<Input, Output>;
export const sculptureHollowCastWallVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/sculpture-hollow-cast-wall-volume",
    title: "Sculpture Hollow Cast Wall Volume Tool",
    description: "Closed rectangular shell with uniform inward wall thickness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerWidth: { type: "number" },
        outerHeight: { type: "number" },
        outerDepth: { type: "number" },
        wall: { type: "number", minimum: 0 },
      },
      required: ["outerWidth", "outerHeight", "outerDepth", "wall"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        materialVolume: { type: "number" },
        cavityVolume: { type: "number" },
      },
      required: ["materialVolume", "cavityVolume"],
    },
    ports: {
      inputs: [
        {
          id: "outerWidth",
          label: "Outer Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerHeight",
          label: "Outer Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerDepth",
          label: "Outer Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wall",
          label: "Wall",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "materialVolume",
          label: "Material Volume",
          valueType: { type: "number" },
        },
        {
          id: "cavityVolume",
          label: "Cavity Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sculptureHollowCastWallVolumeTool.execute;
export default sculptureHollowCastWallVolumeTool;
