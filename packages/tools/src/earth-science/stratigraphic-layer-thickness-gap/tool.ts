import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topDepth: number;
  readonly bottomDepth: number;
  readonly suppliedThickness: number;
};
export type Output = { readonly thickness: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDepth: { type: "number" },
    bottomDepth: { type: "number" },
    suppliedThickness: { type: "number", minimum: 0 },
  },
  required: ["topDepth", "bottomDepth", "suppliedThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { thickness: { type: "number" }, residual: { type: "number" } },
  required: ["thickness", "residual"],
} as const;
/** Calculate stratigraphic layer thickness gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth, suppliedThickness } = request;
  const compute = (): Output => {
    H.domain(bottomDepth >= topDepth && suppliedThickness >= 0);
    return {
      thickness: bottomDepth - topDepth,
      residual: suppliedThickness - bottomDepth + topDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topDepth: 10, bottomDepth: 15, suppliedThickness: 4 },
  output: { thickness: 5, residual: -1 },
} satisfies ToolExample<Input, Output>;
export const stratigraphicLayerThicknessGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/stratigraphic-layer-thickness-gap",
    title: "Stratigraphic Layer Thickness Gap Tool",
    description:
      "Calculate stratigraphic layer thickness gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topDepth: { type: "number" },
        bottomDepth: { type: "number" },
        suppliedThickness: { type: "number", minimum: 0 },
      },
      required: ["topDepth", "bottomDepth", "suppliedThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thickness: { type: "number" },
        residual: { type: "number" },
      },
      required: ["thickness", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "topDepth",
          label: "Top Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomDepth",
          label: "Bottom Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThickness",
          label: "Supplied Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "thickness", label: "Thickness", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stratigraphicLayerThicknessGapTool.execute;
export default stratigraphicLayerThicknessGapTool;
