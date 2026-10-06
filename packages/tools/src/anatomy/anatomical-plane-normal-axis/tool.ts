import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly plane: string };
export type Output = { readonly normalAxis: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plane: {
      type: "string",
      maxLength: 8192,
      enum: ["sagittal", "coronal", "transverse"],
    },
  },
  required: ["plane"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalAxis: { type: "string", maxLength: 8192 } },
  required: ["normalAxis"],
} as const;
/** Return the undirected standard anatomical normal axis for one named sagittal, coronal, or transverse plane. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plane } = request;
  const compute = (): Output => {
    H.domain(["sagittal", "coronal", "transverse"].includes(plane), "plane");
    return {
      normalAxis:
        plane === "sagittal"
          ? "left-right"
          : plane === "coronal"
            ? "anterior-posterior"
            : "superior-inferior",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plane: "sagittal" },
  output: { normalAxis: "left-right" },
} satisfies ToolExample<Input, Output>;
export const anatomicalPlaneNormalAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/anatomical-plane-normal-axis",
    title: "Anatomical Plane Normal Axis",
    description:
      "Return the undirected standard anatomical normal axis for one named sagittal, coronal, or transverse plane.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plane: {
          type: "string",
          maxLength: 8192,
          enum: ["sagittal", "coronal", "transverse"],
        },
      },
      required: ["plane"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalAxis: { type: "string", maxLength: 8192 } },
      required: ["normalAxis"],
    },
    ports: {
      inputs: [
        {
          id: "plane",
          label: "Plane",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalAxis",
          label: "Normal Axis",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = anatomicalPlaneNormalAxisTool.execute;
export default anatomicalPlaneNormalAxisTool;
