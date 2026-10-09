import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upstreamElevation: number;
  readonly outletElevation: number;
};
export type Output = { readonly signedDrop: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstreamElevation: { type: "number" },
    outletElevation: { type: "number" },
  },
  required: ["upstreamElevation", "outletElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDrop: { type: "number" } },
  required: ["signedDrop"],
} as const;
/** Calculate supplied upstream-minus-outlet elevation on a shared vertical datum without estimating relief from a terrain model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upstreamElevation, outletElevation } = request;
  const compute = (): Output => {
    return { signedDrop: upstreamElevation - outletElevation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upstreamElevation: 120, outletElevation: 80 },
  output: { signedDrop: 40 },
} satisfies ToolExample<Input, Output>;
export const catchmentOutletElevationDropTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/catchment-outlet-elevation-drop-term",
    title: "Catchment Outlet Elevation Drop Term Tool",
    description:
      "Calculate supplied upstream-minus-outlet elevation on a shared vertical datum without estimating relief from a terrain model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upstreamElevation: { type: "number" },
        outletElevation: { type: "number" },
      },
      required: ["upstreamElevation", "outletElevation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDrop: { type: "number" } },
      required: ["signedDrop"],
    },
    ports: {
      inputs: [
        {
          id: "upstreamElevation",
          label: "Upstream Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletElevation",
          label: "Outlet Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDrop",
          label: "Signed Drop",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = catchmentOutletElevationDropTermTool.execute;
export default catchmentOutletElevationDropTermTool;
