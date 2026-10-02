import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topWidth: number;
  readonly bottomWidth: number;
  readonly depth: number;
};
export type Output = { readonly volumePerMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topWidth: { type: "number" },
    bottomWidth: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
  },
  required: ["topWidth", "bottomWidth", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumePerMeter: { type: "number" } },
  required: ["volumePerMeter"],
} as const;
/** Ideal trapezoidal storage volume per unit contour length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topWidth, bottomWidth, depth } = request;
  const compute = (): Output => {
    H.domain(topWidth >= bottomWidth && bottomWidth >= 0 && depth >= 0);
    return { volumePerMeter: ((topWidth + bottomWidth) * depth) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topWidth: 2, bottomWidth: 1, depth: 0.5 },
  output: { volumePerMeter: 0.75 },
} satisfies ToolExample<Input, Output>;
export const swaleContourStorageOneMeterTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/swale-contour-storage-one-meter-term",
    title: "Swale Contour Storage One Meter Term Tool",
    description: "Ideal trapezoidal storage volume per unit contour length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topWidth: { type: "number" },
        bottomWidth: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
      },
      required: ["topWidth", "bottomWidth", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumePerMeter: { type: "number" } },
      required: ["volumePerMeter"],
    },
    ports: {
      inputs: [
        {
          id: "topWidth",
          label: "Top Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomWidth",
          label: "Bottom Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumePerMeter",
          label: "Volume Per Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = swaleContourStorageOneMeterTermTool.execute;
export default swaleContourStorageOneMeterTermTool;
