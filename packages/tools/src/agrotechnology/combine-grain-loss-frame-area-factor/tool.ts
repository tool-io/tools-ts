import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly frameArea: number;
  readonly kernelMass: number;
  readonly frames: number;
};
export type Output = { readonly massPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    frameArea: { type: "number", exclusiveMinimum: 0 },
    kernelMass: { type: "number", minimum: 0 },
    frames: { type: "integer", minimum: 1 },
  },
  required: ["count", "frameArea", "kernelMass", "frames"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massPerArea: { type: "number" } },
  required: ["massPerArea"],
} as const;
/** Calculate combine grain loss frame area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, frameArea, kernelMass, frames } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.integer(frames, 1);
    H.positive(frameArea);
    H.domain(kernelMass >= 0);
    return { massPerArea: (count * kernelMass) / (frameArea * frames) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 100, frameArea: 0.5, kernelMass: 0.04, frames: 2 },
  output: { massPerArea: 4 },
} satisfies ToolExample<Input, Output>;
export const combineGrainLossFrameAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/combine-grain-loss-frame-area-factor",
    title: "Combine Grain Loss Frame Area Factor Tool",
    description:
      "Calculate combine grain loss frame area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        frameArea: { type: "number", exclusiveMinimum: 0 },
        kernelMass: { type: "number", minimum: 0 },
        frames: { type: "integer", minimum: 1 },
      },
      required: ["count", "frameArea", "kernelMass", "frames"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massPerArea: { type: "number" } },
      required: ["massPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameArea",
          label: "Frame Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "kernelMass",
          label: "Kernel Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frames",
          label: "Frames",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "massPerArea",
          label: "Mass Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = combineGrainLossFrameAreaFactorTool.execute;
export default combineGrainLossFrameAreaFactorTool;
