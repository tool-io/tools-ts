import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerHeights: readonly number[];
  readonly baseHeight: number;
  readonly measuredHeight: number;
};
export type Output = {
  readonly expectedHeight: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerHeights: { type: "array", maxItems: 256, items: { type: "number" } },
    baseHeight: { type: "number", minimum: 0 },
    measuredHeight: { type: "number", minimum: 0 },
  },
  required: ["layerHeights", "baseHeight", "measuredHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedHeight: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedHeight", "residual"],
} as const;
/** Calculate biofabrication build height residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerHeights, baseHeight, measuredHeight } = request;
  const compute = (): Output => {
    H.domain(
      layerHeights.every((x) => x >= 0) &&
        baseHeight >= 0 &&
        measuredHeight >= 0,
    );
    return {
      expectedHeight: baseHeight + layerHeights.reduce((a, b) => a + b, 0),
      residual:
        measuredHeight - baseHeight - layerHeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { layerHeights: [0.2, 0.3, 0.5], baseHeight: 1, measuredHeight: 2.1 },
  output: { expectedHeight: 2, residual: 0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const biofabricationBuildHeightResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/biofabrication-build-height-residual",
    title: "Biofabrication Build Height Residual Tool",
    description:
      "Calculate biofabrication build height residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        baseHeight: { type: "number", minimum: 0 },
        measuredHeight: { type: "number", minimum: 0 },
      },
      required: ["layerHeights", "baseHeight", "measuredHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedHeight: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedHeight", "residual"],
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
          id: "baseHeight",
          label: "Base Height",
          required: true,
          valueType: { type: "number" },
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
          id: "expectedHeight",
          label: "Expected Height",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biofabricationBuildHeightResidualTool.execute;
export default biofabricationBuildHeightResidualTool;
