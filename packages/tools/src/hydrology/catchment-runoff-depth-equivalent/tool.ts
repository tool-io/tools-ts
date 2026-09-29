import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runoffVolume: number;
  readonly catchmentArea: number;
  readonly suppliedDepthScale: number;
};
export type Output = { readonly depth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runoffVolume: { type: "number", minimum: 0 },
    catchmentArea: { type: "number", exclusiveMinimum: 0 },
    suppliedDepthScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["runoffVolume", "catchmentArea", "suppliedDepthScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "number" } },
  required: ["depth"],
} as const;
/** Convert supplied volume per area to a depth with an explicit length-unit factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runoffVolume, catchmentArea, suppliedDepthScale } = request;
  const compute = (): Output => {
    H.domain(runoffVolume >= 0);
    H.positive(catchmentArea);
    H.positive(suppliedDepthScale);
    return { depth: (runoffVolume / catchmentArea) * suppliedDepthScale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runoffVolume: 1000, catchmentArea: 2000, suppliedDepthScale: 1000 },
  output: { depth: 500 },
} satisfies ToolExample<Input, Output>;
export const catchmentRunoffDepthEquivalentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/catchment-runoff-depth-equivalent",
    title: "Catchment Runoff Depth Equivalent Tool",
    description:
      "Convert supplied volume per area to a depth with an explicit length-unit factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runoffVolume: { type: "number", minimum: 0 },
        catchmentArea: { type: "number", exclusiveMinimum: 0 },
        suppliedDepthScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["runoffVolume", "catchmentArea", "suppliedDepthScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "number" } },
      required: ["depth"],
    },
    ports: {
      inputs: [
        {
          id: "runoffVolume",
          label: "Runoff Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "catchmentArea",
          label: "Catchment Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDepthScale",
          label: "Supplied Depth Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "depth", label: "Depth", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = catchmentRunoffDepthEquivalentTool.execute;
export default catchmentRunoffDepthEquivalentTool;
