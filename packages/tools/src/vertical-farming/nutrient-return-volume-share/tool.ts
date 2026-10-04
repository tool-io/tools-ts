import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnVolume: number;
  readonly circulatedVolume: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnVolume: { type: "number", minimum: 0 },
    circulatedVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["returnVolume", "circulatedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate nutrient return volume share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnVolume, circulatedVolume } = request;
  const compute = (): Output => {
    H.positive(circulatedVolume);
    H.domain(returnVolume >= 0 && returnVolume <= circulatedVolume);
    return { share: returnVolume / circulatedVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnVolume: 8, circulatedVolume: 10 },
  output: { share: 0.8 },
} satisfies ToolExample<Input, Output>;
export const nutrientReturnVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/nutrient-return-volume-share",
    title: "Nutrient Return Volume Share Tool",
    description:
      "Calculate nutrient return volume share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnVolume: { type: "number", minimum: 0 },
        circulatedVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["returnVolume", "circulatedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "returnVolume",
          label: "Return Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "circulatedVolume",
          label: "Circulated Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = nutrientReturnVolumeShareTool.execute;
export default nutrientReturnVolumeShareTool;
