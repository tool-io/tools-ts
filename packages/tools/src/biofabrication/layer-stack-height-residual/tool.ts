import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerHeights: readonly number[];
  readonly measuredHeight: number;
};
export type Output = {
  readonly summedHeight: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerHeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    measuredHeight: { type: "number", minimum: 0 },
  },
  required: ["layerHeights", "measuredHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summedHeight: { type: "number" },
    residual: { type: "number" },
  },
  required: ["summedHeight", "residual"],
} as const;
/** Calculate layer stack height residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerHeights, measuredHeight } = request;
  const compute = (): Output => {
    H.domain(measuredHeight >= 0 && layerHeights.every((x) => x >= 0));
    return {
      summedHeight: layerHeights.reduce((a, b) => a + b, 0),
      residual: measuredHeight - layerHeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { layerHeights: [1, 2, 3], measuredHeight: 7 },
  output: { summedHeight: 6, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const layerStackHeightResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/layer-stack-height-residual",
    title: "Layer Stack Height Residual Tool",
    description:
      "Calculate layer stack height residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        measuredHeight: { type: "number", minimum: 0 },
      },
      required: ["layerHeights", "measuredHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        summedHeight: { type: "number" },
        residual: { type: "number" },
      },
      required: ["summedHeight", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "layerHeights",
          label: "Layer Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "measuredHeight",
          label: "Measured Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "summedHeight",
          label: "Summed Height",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = layerStackHeightResidualTool.execute;
export default layerStackHeightResidualTool;
