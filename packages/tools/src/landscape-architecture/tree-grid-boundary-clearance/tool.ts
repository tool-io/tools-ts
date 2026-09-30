import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerDistance: number;
  readonly canopyRadius: number;
  readonly suppliedSetback: number;
};
export type Output = { readonly clearance: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerDistance: { type: "number", minimum: 0 },
    canopyRadius: { type: "number", minimum: 0 },
    suppliedSetback: { type: "number", minimum: 0 },
  },
  required: ["centerDistance", "canopyRadius", "suppliedSetback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearance: { type: "number" }, slack: { type: "number" } },
  required: ["clearance", "slack"],
} as const;
/** Calculate tree grid boundary clearance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerDistance, canopyRadius, suppliedSetback } = request;
  const compute = (): Output => {
    H.domain(centerDistance >= 0 && canopyRadius >= 0 && suppliedSetback >= 0);
    return {
      clearance: centerDistance - canopyRadius,
      slack: centerDistance - canopyRadius - suppliedSetback,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerDistance: 5, canopyRadius: 2, suppliedSetback: 1 },
  output: { clearance: 3, slack: 2 },
} satisfies ToolExample<Input, Output>;
export const treeGridBoundaryClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/tree-grid-boundary-clearance",
    title: "Tree Grid Boundary Clearance Tool",
    description:
      "Calculate tree grid boundary clearance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerDistance: { type: "number", minimum: 0 },
        canopyRadius: { type: "number", minimum: 0 },
        suppliedSetback: { type: "number", minimum: 0 },
      },
      required: ["centerDistance", "canopyRadius", "suppliedSetback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clearance: { type: "number" }, slack: { type: "number" } },
      required: ["clearance", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "centerDistance",
          label: "Center Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canopyRadius",
          label: "Canopy Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSetback",
          label: "Supplied Setback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = treeGridBoundaryClearanceTool.execute;
export default treeGridBoundaryClearanceTool;
