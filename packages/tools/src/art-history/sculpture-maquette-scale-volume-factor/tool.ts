import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearScale: number;
  readonly maquetteVolume: number;
};
export type Output = {
  readonly volumeFactor: number;
  readonly fullVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearScale: { type: "number", exclusiveMinimum: 0 },
    maquetteVolume: { type: "number", minimum: 0 },
  },
  required: ["linearScale", "maquetteVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeFactor: { type: "number" },
    fullVolume: { type: "number" },
  },
  required: ["volumeFactor", "fullVolume"],
} as const;
/** Calculate sculpture maquette scale volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { linearScale, maquetteVolume } = request;
  const compute = (): Output => {
    H.positive(linearScale);
    H.domain(maquetteVolume >= 0);
    return {
      volumeFactor: linearScale ** 3,
      fullVolume: maquetteVolume * linearScale ** 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { linearScale: 10, maquetteVolume: 2 },
  output: { volumeFactor: 1000, fullVolume: 2000 },
} satisfies ToolExample<Input, Output>;
export const sculptureMaquetteScaleVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/sculpture-maquette-scale-volume-factor",
    title: "Sculpture Maquette Scale Volume Factor Tool",
    description:
      "Calculate sculpture maquette scale volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearScale: { type: "number", exclusiveMinimum: 0 },
        maquetteVolume: { type: "number", minimum: 0 },
      },
      required: ["linearScale", "maquetteVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeFactor: { type: "number" },
        fullVolume: { type: "number" },
      },
      required: ["volumeFactor", "fullVolume"],
    },
    ports: {
      inputs: [
        {
          id: "linearScale",
          label: "Linear Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maquetteVolume",
          label: "Maquette Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeFactor",
          label: "Volume Factor",
          valueType: { type: "number" },
        },
        {
          id: "fullVolume",
          label: "Full Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sculptureMaquetteScaleVolumeFactorTool.execute;
export default sculptureMaquetteScaleVolumeFactorTool;
