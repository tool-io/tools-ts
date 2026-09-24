import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalSpeed: number;
  readonly faceArea: number;
  readonly cellVolume: number;
  readonly step: number;
};
export type Output = { readonly courantContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalSpeed: { type: "number" },
    faceArea: { type: "number", minimum: 0 },
    cellVolume: { type: "number", exclusiveMinimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["normalSpeed", "faceArea", "cellVolume", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { courantContribution: { type: "number" } },
  required: ["courantContribution"],
} as const;
/** Calculate finite volume courant one face term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normalSpeed, faceArea, cellVolume, step } = request;
  const compute = (): Output => {
    H.domain(faceArea >= 0 && step >= 0);
    H.positive(cellVolume);
    return {
      courantContribution:
        (Math.abs(normalSpeed) * faceArea * step) / cellVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normalSpeed: 2, faceArea: 3, cellVolume: 6, step: 0.5 },
  output: { courantContribution: 0.5 },
} satisfies ToolExample<Input, Output>;
export const finiteVolumeCourantOneFaceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/finite-volume-courant-one-face-term",
    title: "Finite Volume Courant One Face Term Tool",
    description:
      "Calculate finite volume courant one face term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalSpeed: { type: "number" },
        faceArea: { type: "number", minimum: 0 },
        cellVolume: { type: "number", exclusiveMinimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["normalSpeed", "faceArea", "cellVolume", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { courantContribution: { type: "number" } },
      required: ["courantContribution"],
    },
    ports: {
      inputs: [
        {
          id: "normalSpeed",
          label: "Normal Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "faceArea",
          label: "Face Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellVolume",
          label: "Cell Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "courantContribution",
          label: "Courant Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteVolumeCourantOneFaceTermTool.execute;
export default finiteVolumeCourantOneFaceTermTool;
