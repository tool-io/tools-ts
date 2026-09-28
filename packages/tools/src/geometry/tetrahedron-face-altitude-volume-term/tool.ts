import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly faceArea: number; readonly altitude: number };
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faceArea: { type: "number", minimum: 0 },
    altitude: { type: "number", minimum: 0 },
  },
  required: ["faceArea", "altitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Calculate tetrahedron face altitude volume term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { faceArea, altitude } = input;
  const compute = (): Output => {
    H.domain(faceArea >= 0 && altitude >= 0);
    return { volume: (faceArea * altitude) / 3 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { faceArea: 6, altitude: 4 },
  output: { volume: 8 },
} satisfies ToolExample<Input, Output>;
export const tetrahedronFaceAltitudeVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/tetrahedron-face-altitude-volume-term",
    title: "Tetrahedron Face Altitude Volume Term Tool",
    description:
      "Calculate tetrahedron face altitude volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        faceArea: { type: "number", minimum: 0 },
        altitude: { type: "number", minimum: 0 },
      },
      required: ["faceArea", "altitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "faceArea",
          label: "Face Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "altitude",
          label: "Altitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tetrahedronFaceAltitudeVolumeTermTool.execute;
export default tetrahedronFaceAltitudeVolumeTermTool;
