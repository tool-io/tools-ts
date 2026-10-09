import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureStart: number;
  readonly imageCaptureTime: number;
};
export type Output = { readonly elapsedTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureStart: { type: "number" },
    imageCaptureTime: { type: "number" },
  },
  required: ["procedureStart", "imageCaptureTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedTime: { type: "number" } },
  required: ["elapsedTime"],
} as const;
/** Calculate supplied endoscopy image capture elapsed time from ordered monotonic timestamps without evaluating procedure quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureStart, imageCaptureTime } = request;
  const compute = (): Output => {
    H.domain(imageCaptureTime >= procedureStart, "imageCaptureTime");
    return { elapsedTime: imageCaptureTime - procedureStart };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureStart: 100, imageCaptureTime: 135 },
  output: { elapsedTime: 35 },
} satisfies ToolExample<Input, Output>;
export const endoscopyImageCaptureElapsedTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/endoscopy-image-capture-elapsed-time",
    title: "Endoscopy Image Capture Elapsed Time Tool",
    description:
      "Calculate supplied endoscopy image capture elapsed time from ordered monotonic timestamps without evaluating procedure quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureStart: { type: "number" },
        imageCaptureTime: { type: "number" },
      },
      required: ["procedureStart", "imageCaptureTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedTime: { type: "number" } },
      required: ["elapsedTime"],
    },
    ports: {
      inputs: [
        {
          id: "procedureStart",
          label: "Procedure Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageCaptureTime",
          label: "Image Capture Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = endoscopyImageCaptureElapsedTimeTool.execute;
export default endoscopyImageCaptureElapsedTimeTool;
