import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coordinate: number; readonly cofactor: number };
export type Output = { readonly volumeContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" }, cofactor: { type: "number" } },
  required: ["coordinate", "cofactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeContribution: { type: "number" } },
  required: ["volumeContribution"],
} as const;
/** Calculate tetrahedron oriented volume single term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coordinate, cofactor } = input;
  const compute = (): Output => {
    return { volumeContribution: (coordinate * cofactor) / 6 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinate: 3, cofactor: 8 },
  output: { volumeContribution: 4 },
} satisfies ToolExample<Input, Output>;
export const tetrahedronOrientedVolumeSingleTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/tetrahedron-oriented-volume-single-term",
      title: "Tetrahedron Oriented Volume Single Term Tool",
      description:
        "Calculate tetrahedron oriented volume single term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "number" },
          cofactor: { type: "number" },
        },
        required: ["coordinate", "cofactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { volumeContribution: { type: "number" } },
        required: ["volumeContribution"],
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
            id: "cofactor",
            label: "Cofactor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "volumeContribution",
            label: "Volume Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tetrahedronOrientedVolumeSingleTermTool.execute;
export default tetrahedronOrientedVolumeSingleTermTool;
