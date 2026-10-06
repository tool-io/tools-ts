import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly heightMicrometers: number };
export type Output = { readonly heightMillimeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightMicrometers: { type: "number", minimum: 0 } },
  required: ["heightMicrometers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightMillimeters: { type: "number" } },
  required: ["heightMillimeters"],
} as const;
/** Convert a supplied nonnegative paint-flake height from micrometers to millimeters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heightMicrometers } = request;
  const compute = (): Output => {
    H.domain(heightMicrometers >= 0, "heightMicrometers");
    return { heightMillimeters: heightMicrometers / 1000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heightMicrometers: 250 },
  output: { heightMillimeters: 0.25 },
} satisfies ToolExample<Input, Output>;
export const paintLayerFlakeHeightUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/paint-layer-flake-height-unit",
    title: "Paint Layer Flake Height Unit",
    description:
      "Convert a supplied nonnegative paint-flake height from micrometers to millimeters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightMicrometers: { type: "number", minimum: 0 } },
      required: ["heightMicrometers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightMillimeters: { type: "number" } },
      required: ["heightMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "heightMicrometers",
          label: "Height Micrometers",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightMillimeters",
          label: "Height Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paintLayerFlakeHeightUnitTool.execute;
export default paintLayerFlakeHeightUnitTool;
