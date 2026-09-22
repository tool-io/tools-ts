import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topConcentration: number;
  readonly bottomConcentration: number;
  readonly thickness: number;
};
export type Output = {
  readonly meanConcentration: number;
  readonly arealInventory: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topConcentration: { type: "number", minimum: 0 },
    bottomConcentration: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
  },
  required: ["topConcentration", "bottomConcentration", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanConcentration: { type: "number" },
    arealInventory: { type: "number" },
  },
  required: ["meanConcentration", "arealInventory"],
} as const;
/** Trapezoidal depth integral with concentration varying linearly across one layer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topConcentration, bottomConcentration, thickness } = request;
  const compute = (): Output => {
    H.domain(
      topConcentration >= 0 && bottomConcentration >= 0 && thickness >= 0,
    );
    return {
      meanConcentration: (topConcentration + bottomConcentration) / 2,
      arealInventory:
        ((topConcentration + bottomConcentration) * thickness) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topConcentration: 2, bottomConcentration: 6, thickness: 5 },
  output: { meanConcentration: 4, arealInventory: 20 },
} satisfies ToolExample<Input, Output>;
export const waterColumnIntegratedOneLayerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/water-column-integrated-one-layer",
    title: "Water Column Integrated One Layer Tool",
    description:
      "Trapezoidal depth integral with concentration varying linearly across one layer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topConcentration: { type: "number", minimum: 0 },
        bottomConcentration: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
      },
      required: ["topConcentration", "bottomConcentration", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanConcentration: { type: "number" },
        arealInventory: { type: "number" },
      },
      required: ["meanConcentration", "arealInventory"],
    },
    ports: {
      inputs: [
        {
          id: "topConcentration",
          label: "Top Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomConcentration",
          label: "Bottom Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanConcentration",
          label: "Mean Concentration",
          valueType: { type: "number" },
        },
        {
          id: "arealInventory",
          label: "Areal Inventory",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterColumnIntegratedOneLayerTool.execute;
export default waterColumnIntegratedOneLayerTool;
