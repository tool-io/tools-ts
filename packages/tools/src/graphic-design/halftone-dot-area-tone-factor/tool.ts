import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dotDiameter: number;
  readonly cellPitch: number;
  readonly circular: boolean;
};
export type Output = {
  readonly dotArea: number;
  readonly nominalCoverage: number;
  readonly exceedsCellArea: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dotDiameter: { type: "number", minimum: 0 },
    cellPitch: { type: "number", exclusiveMinimum: 0 },
    circular: { type: "boolean" },
  },
  required: ["dotDiameter", "cellPitch", "circular"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dotArea: { type: "number" },
    nominalCoverage: { type: "number" },
    exceedsCellArea: { type: "boolean" },
  },
  required: ["dotArea", "nominalCoverage", "exceedsCellArea"],
} as const;
/** Isolated ideal dot area divided by square cell area, not a dot-gain model or an overlap-corrected halftone screen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dotDiameter, cellPitch, circular } = request;
  const compute = (): Output => {
    H.domain(dotDiameter >= 0);
    H.positive(cellPitch);
    return {
      dotArea: (circular ? Math.PI / 4 : 1) * dotDiameter ** 2,
      nominalCoverage:
        (circular ? Math.PI / 4 : 1) * (dotDiameter / cellPitch) ** 2,
      exceedsCellArea:
        (circular ? Math.PI / 4 : 1) * (dotDiameter / cellPitch) ** 2 > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dotDiameter: 1, cellPitch: 2, circular: true },
  output: {
    dotArea: 0.7853981633974483,
    nominalCoverage: 0.19634954084936207,
    exceedsCellArea: false,
  },
} satisfies ToolExample<Input, Output>;
export const halftoneDotAreaToneFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/halftone-dot-area-tone-factor",
    title: "Halftone Dot Area Tone Factor Tool",
    description:
      "Isolated ideal dot area divided by square cell area, not a dot-gain model or an overlap-corrected halftone screen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dotDiameter: { type: "number", minimum: 0 },
        cellPitch: { type: "number", exclusiveMinimum: 0 },
        circular: { type: "boolean" },
      },
      required: ["dotDiameter", "cellPitch", "circular"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dotArea: { type: "number" },
        nominalCoverage: { type: "number" },
        exceedsCellArea: { type: "boolean" },
      },
      required: ["dotArea", "nominalCoverage", "exceedsCellArea"],
    },
    ports: {
      inputs: [
        {
          id: "dotDiameter",
          label: "Dot Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellPitch",
          label: "Cell Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "circular",
          label: "Circular",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "dotArea", label: "Dot Area", valueType: { type: "number" } },
        {
          id: "nominalCoverage",
          label: "Nominal Coverage",
          valueType: { type: "number" },
        },
        {
          id: "exceedsCellArea",
          label: "Exceeds Cell Area",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = halftoneDotAreaToneFactorTool.execute;
export default halftoneDotAreaToneFactorTool;
