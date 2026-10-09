import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionId: string;
  readonly suppliedOrientation: string;
  readonly referenceFrame: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedOrientation: { type: "string", maxLength: 8192, minLength: 1 },
    referenceFrame: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sectionId", "suppliedOrientation", "referenceFrame"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied histology section orientation and reference frame without inferring anatomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionId, suppliedOrientation, referenceFrame } = request;
  const compute = (): Output => {
    H.domain(sectionId.length > 0, "sectionId");
    H.domain(suppliedOrientation.length > 0, "suppliedOrientation");
    H.domain(referenceFrame.length > 0, "referenceFrame");
    return {
      token: JSON.stringify([sectionId, suppliedOrientation, referenceFrame]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionId: "S17",
    suppliedOrientation: "transverse",
    referenceFrame: "specimen long axis",
  },
  output: { token: '["S17","transverse","specimen long axis"]' },
} satisfies ToolExample<Input, Output>;
export const histologySectionOrientationMarkerTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/histology-section-orientation-marker-token",
      title: "Histology Section Orientation Marker Token Tool",
      description:
        "Preserve an explicitly supplied histology section orientation and reference frame without inferring anatomy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sectionId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedOrientation: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          referenceFrame: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sectionId", "suppliedOrientation", "referenceFrame"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "sectionId",
            label: "Section Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedOrientation",
            label: "Supplied Orientation",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceFrame",
            label: "Reference Frame",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = histologySectionOrientationMarkerTokenTool.execute;
export default histologySectionOrientationMarkerTokenTool;
