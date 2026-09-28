import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitudeRadians: number;
  readonly longitudeWidthRadians: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitudeRadians: { type: "number" },
    longitudeWidthRadians: { type: "number", minimum: 0 },
  },
  required: ["latitudeRadians", "longitudeWidthRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Return a supplied cell-center cosine latitude weighting term, not an exact finite-latitude-band area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitudeRadians, longitudeWidthRadians } = request;
  const compute = (): Output => {
    H.domain(
      latitudeRadians >= -Math.PI / 2 &&
        latitudeRadians <= Math.PI / 2 &&
        longitudeWidthRadians >= 0,
    );
    return { weight: Math.cos(latitudeRadians) * longitudeWidthRadians };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitudeRadians: 0, longitudeWidthRadians: 2 },
  output: { weight: 2 },
} satisfies ToolExample<Input, Output>;
export const latitudeCellCosineWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/latitude-cell-cosine-weight",
    title: "Latitude Cell Cosine Weight Tool",
    description:
      "Return a supplied cell-center cosine latitude weighting term, not an exact finite-latitude-band area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitudeRadians: { type: "number" },
        longitudeWidthRadians: { type: "number", minimum: 0 },
      },
      required: ["latitudeRadians", "longitudeWidthRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "latitudeRadians",
          label: "Latitude Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "longitudeWidthRadians",
          label: "Longitude Width Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = latitudeCellCosineWeightTool.execute;
export default latitudeCellCosineWeightTool;
