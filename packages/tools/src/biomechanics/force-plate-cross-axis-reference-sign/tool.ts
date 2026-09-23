import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly plateSign: number;
  readonly laboratorySign: number;
};
export type Output = {
  readonly laboratoryForce: number;
  readonly signFlipped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    plateSign: { type: "integer" },
    laboratorySign: { type: "integer" },
  },
  required: ["force", "plateSign", "laboratorySign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    laboratoryForce: { type: "number" },
    signFlipped: { type: "boolean" },
  },
  required: ["laboratoryForce", "signFlipped"],
} as const;
/** Calculate force plate cross axis reference sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, plateSign, laboratorySign } = request;
  const compute = (): Output => {
    H.domain([1, -1].includes(plateSign) && [1, -1].includes(laboratorySign));
    return {
      laboratoryForce: force * plateSign * laboratorySign,
      signFlipped: plateSign !== laboratorySign,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 100, plateSign: 1, laboratorySign: -1 },
  output: { laboratoryForce: -100, signFlipped: true },
} satisfies ToolExample<Input, Output>;
export const forcePlateCrossAxisReferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/force-plate-cross-axis-reference-sign",
    title: "Force Plate Cross Axis Reference Sign Tool",
    description:
      "Calculate force plate cross axis reference sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        plateSign: { type: "integer" },
        laboratorySign: { type: "integer" },
      },
      required: ["force", "plateSign", "laboratorySign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laboratoryForce: { type: "number" },
        signFlipped: { type: "boolean" },
      },
      required: ["laboratoryForce", "signFlipped"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateSign",
          label: "Plate Sign",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "laboratorySign",
          label: "Laboratory Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "laboratoryForce",
          label: "Laboratory Force",
          valueType: { type: "number" },
        },
        {
          id: "signFlipped",
          label: "Sign Flipped",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = forcePlateCrossAxisReferenceSignTool.execute;
export default forcePlateCrossAxisReferenceSignTool;
