import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalDepth: number;
  readonly drainageDepth: number;
  readonly freeboard: number;
};
export type Output = { readonly soilDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDepth: { type: "number" },
    drainageDepth: { type: "number", minimum: 0 },
    freeboard: { type: "number", minimum: 0 },
  },
  required: ["totalDepth", "drainageDepth", "freeboard"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { soilDepth: { type: "number" } },
  required: ["soilDepth"],
} as const;
/** Calculate planter drainage layer net depth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalDepth, drainageDepth, freeboard } = request;
  const compute = (): Output => {
    H.domain(
      drainageDepth >= 0 &&
        freeboard >= 0 &&
        totalDepth >= drainageDepth + freeboard,
    );
    return { soilDepth: totalDepth - drainageDepth - freeboard };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalDepth: 60, drainageDepth: 10, freeboard: 5 },
  output: { soilDepth: 45 },
} satisfies ToolExample<Input, Output>;
export const planterDrainageLayerNetDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planter-drainage-layer-net-depth",
    title: "Planter Drainage Layer Net Depth Tool",
    description:
      "Calculate planter drainage layer net depth from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDepth: { type: "number" },
        drainageDepth: { type: "number", minimum: 0 },
        freeboard: { type: "number", minimum: 0 },
      },
      required: ["totalDepth", "drainageDepth", "freeboard"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { soilDepth: { type: "number" } },
      required: ["soilDepth"],
    },
    ports: {
      inputs: [
        {
          id: "totalDepth",
          label: "Total Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainageDepth",
          label: "Drainage Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freeboard",
          label: "Freeboard",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "soilDepth", label: "Soil Depth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = planterDrainageLayerNetDepthTool.execute;
export default planterDrainageLayerNetDepthTool;
