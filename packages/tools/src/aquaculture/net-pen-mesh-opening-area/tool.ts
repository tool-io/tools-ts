import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pitch: number;
  readonly twineDiameter: number;
  readonly cells: number;
};
export type Output = {
  readonly clearWidth: number;
  readonly openArea: number;
  readonly openFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pitch: { type: "number", exclusiveMinimum: 0 },
    twineDiameter: { type: "number", minimum: 0 },
    cells: { type: "integer", minimum: 0 },
  },
  required: ["pitch", "twineDiameter", "cells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearWidth: { type: "number" },
    openArea: { type: "number" },
    openFraction: { type: "number" },
  },
  required: ["clearWidth", "openArea", "openFraction"],
} as const;
/** Ideal square knotless mesh cells; excludes knots, deformation and fouling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pitch, twineDiameter, cells } = request;
  const compute = (): Output => {
    H.positive(pitch);
    H.domain(twineDiameter >= 0 && twineDiameter <= pitch);
    H.integer(cells, 0);
    return {
      clearWidth: pitch - twineDiameter,
      openArea: cells * (pitch - twineDiameter) ** 2,
      openFraction: (pitch - twineDiameter) ** 2 / pitch ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pitch: 10, twineDiameter: 2, cells: 100 },
  output: { clearWidth: 8, openArea: 6400, openFraction: 0.64 },
} satisfies ToolExample<Input, Output>;
export const netPenMeshOpeningAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/net-pen-mesh-opening-area",
    title: "Net Pen Mesh Opening Area Tool",
    description:
      "Ideal square knotless mesh cells; excludes knots, deformation and fouling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pitch: { type: "number", exclusiveMinimum: 0 },
        twineDiameter: { type: "number", minimum: 0 },
        cells: { type: "integer", minimum: 0 },
      },
      required: ["pitch", "twineDiameter", "cells"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearWidth: { type: "number" },
        openArea: { type: "number" },
        openFraction: { type: "number" },
      },
      required: ["clearWidth", "openArea", "openFraction"],
    },
    ports: {
      inputs: [
        {
          id: "pitch",
          label: "Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "twineDiameter",
          label: "Twine Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cells",
          label: "Cells",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "clearWidth",
          label: "Clear Width",
          valueType: { type: "number" },
        },
        { id: "openArea", label: "Open Area", valueType: { type: "number" } },
        {
          id: "openFraction",
          label: "Open Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = netPenMeshOpeningAreaTool.execute;
export default netPenMeshOpeningAreaTool;
