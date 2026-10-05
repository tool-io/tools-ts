import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly depthFathoms: number };
export type Output = { readonly label: string; readonly depthMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depthFathoms: { type: "number" } },
  required: ["depthFathoms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    depthMeters: { type: "number" },
  },
  required: ["label", "depthMeters"],
} as const;
/** Label a nonnegative chart depth in international fathoms and convert it to meters using exactly 1.8288 m per fathom. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depthFathoms } = request;
  const compute = (): Output => {
    H.domain(depthFathoms >= 0, "depthFathoms");
    return {
      label: depthFathoms + " fathoms",
      depthMeters: depthFathoms * 1.8288,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depthFathoms: 10 },
  output: { label: "10 fathoms", depthMeters: 18.288 },
} satisfies ToolExample<Input, Output>;
export const fathomDepthChartLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/fathom-depth-chart-label",
    title: "Fathom Depth Chart Label Tool",
    description:
      "Label a nonnegative chart depth in international fathoms and convert it to meters using exactly 1.8288 m per fathom.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depthFathoms: { type: "number" } },
      required: ["depthFathoms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        depthMeters: { type: "number" },
      },
      required: ["label", "depthMeters"],
    },
    ports: {
      inputs: [
        {
          id: "depthFathoms",
          label: "Depth Fathoms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "depthMeters",
          label: "Depth Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fathomDepthChartLabelTool.execute;
export default fathomDepthChartLabelTool;
