import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observance: string; readonly boundary: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observance: { type: "string", maxLength: 8192 },
    boundary: {
      type: "string",
      maxLength: 8192,
      enum: ["midnight", "sunset", "sunrise", "source-defined"],
    },
  },
  required: ["observance", "boundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied public observance day-boundary convention without deriving observance dates or astronomical times. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observance, boundary } = request;
  const compute = (): Output => {
    H.domain(observance.length > 0, "observance");
    H.domain(
      ["midnight", "sunset", "sunrise", "source-defined"].includes(boundary),
      "boundary",
    );
    return { label: observance + " [day boundary: " + boundary + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observance: "Public observance", boundary: "sunset" },
  output: { label: "Public observance [day boundary: sunset]" },
} satisfies ToolExample<Input, Output>;
export const publicObservanceDayBoundaryLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-observance-day-boundary-label",
    title: "Public Observance Day Boundary Label Tool",
    description:
      "Label a supplied public observance day-boundary convention without deriving observance dates or astronomical times.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observance: { type: "string", maxLength: 8192 },
        boundary: {
          type: "string",
          maxLength: 8192,
          enum: ["midnight", "sunset", "sunrise", "source-defined"],
        },
      },
      required: ["observance", "boundary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "observance",
          label: "Observance",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicObservanceDayBoundaryLabelTool.execute;
export default publicObservanceDayBoundaryLabelTool;
