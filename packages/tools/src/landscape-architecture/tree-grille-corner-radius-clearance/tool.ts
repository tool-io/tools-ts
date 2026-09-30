import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingRadius: number;
  readonly trunkRadius: number;
  readonly growthAllowance: number;
  readonly placementError: number;
};
export type Output = { readonly radialMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingRadius: { type: "number", minimum: 0 },
    trunkRadius: { type: "number", minimum: 0 },
    growthAllowance: { type: "number", minimum: 0 },
    placementError: { type: "number" },
  },
  required: [
    "openingRadius",
    "trunkRadius",
    "growthAllowance",
    "placementError",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radialMargin: { type: "number" } },
  required: ["radialMargin"],
} as const;
/** Supplied radial envelope clearance, not a growth forecast or installation criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingRadius, trunkRadius, growthAllowance, placementError } =
    request;
  const compute = (): Output => {
    H.domain(openingRadius >= 0 && trunkRadius >= 0 && growthAllowance >= 0);
    return {
      radialMargin:
        openingRadius -
        trunkRadius -
        growthAllowance -
        Math.abs(placementError),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingRadius: 1,
    trunkRadius: 0.3,
    growthAllowance: 0.2,
    placementError: 0.1,
  },
  output: { radialMargin: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const treeGrilleCornerRadiusClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/tree-grille-corner-radius-clearance",
    title: "Tree Grille Corner Radius Clearance Tool",
    description:
      "Supplied radial envelope clearance, not a growth forecast or installation criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingRadius: { type: "number", minimum: 0 },
        trunkRadius: { type: "number", minimum: 0 },
        growthAllowance: { type: "number", minimum: 0 },
        placementError: { type: "number" },
      },
      required: [
        "openingRadius",
        "trunkRadius",
        "growthAllowance",
        "placementError",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radialMargin: { type: "number" } },
      required: ["radialMargin"],
    },
    ports: {
      inputs: [
        {
          id: "openingRadius",
          label: "Opening Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trunkRadius",
          label: "Trunk Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "growthAllowance",
          label: "Growth Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "placementError",
          label: "Placement Error",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radialMargin",
          label: "Radial Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeGrilleCornerRadiusClearanceTool.execute;
export default treeGrilleCornerRadiusClearanceTool;
