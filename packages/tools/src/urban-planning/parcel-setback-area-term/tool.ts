import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly frontage: number; readonly setback: number };
export type Output = { readonly area: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontage: { type: "number", minimum: 0 },
    setback: { type: "number", minimum: 0 },
  },
  required: ["frontage", "setback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" } },
  required: ["area"],
} as const;
/** Compute one rectangular setback strip from supplied dimensions without accounting for corner overlaps or zoning rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontage, setback } = request;
  const compute = (): Output => {
    H.domain(frontage >= 0 && setback >= 0);
    return { area: frontage * setback };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frontage: 20, setback: 3 },
  output: { area: 60 },
} satisfies ToolExample<Input, Output>;
export const parcelSetbackAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/parcel-setback-area-term",
    title: "Parcel Setback Area Term Tool",
    description:
      "Compute one rectangular setback strip from supplied dimensions without accounting for corner overlaps or zoning rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontage: { type: "number", minimum: 0 },
        setback: { type: "number", minimum: 0 },
      },
      required: ["frontage", "setback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" } },
      required: ["area"],
    },
    ports: {
      inputs: [
        {
          id: "frontage",
          label: "Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setback",
          label: "Setback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "area", label: "Area", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = parcelSetbackAreaTermTool.execute;
export default parcelSetbackAreaTermTool;
