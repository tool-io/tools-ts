import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerToEdge: number;
  readonly holeDiameter: number;
};
export type Output = { readonly clearEdgeMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerToEdge: { type: "number", minimum: 0 },
    holeDiameter: { type: "number", minimum: 0 },
  },
  required: ["centerToEdge", "holeDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearEdgeMargin: { type: "number" } },
  required: ["clearEdgeMargin"],
} as const;
/** Compute signed panel material clearance from a fastener-hole perimeter to a straight edge, using a measured perpendicular center distance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerToEdge, holeDiameter } = request;
  const compute = (): Output => {
    H.domain(centerToEdge >= 0 && holeDiameter >= 0, "centerToEdge");
    return { clearEdgeMargin: centerToEdge - holeDiameter / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerToEdge: 12, holeDiameter: 6 },
  output: { clearEdgeMargin: 9 },
} satisfies ToolExample<Input, Output>;
export const panelFastenerEdgeMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/panel-fastener-edge-margin",
    title: "Panel Fastener Edge Margin Tool",
    description:
      "Compute signed panel material clearance from a fastener-hole perimeter to a straight edge, using a measured perpendicular center distance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerToEdge: { type: "number", minimum: 0 },
        holeDiameter: { type: "number", minimum: 0 },
      },
      required: ["centerToEdge", "holeDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clearEdgeMargin: { type: "number" } },
      required: ["clearEdgeMargin"],
    },
    ports: {
      inputs: [
        {
          id: "centerToEdge",
          label: "Center To Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "holeDiameter",
          label: "Hole Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "clearEdgeMargin",
          label: "Clear Edge Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = panelFastenerEdgeMarginTool.execute;
export default panelFastenerEdgeMarginTool;
