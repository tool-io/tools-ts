import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly diameterIncrement: number;
};
export type Output = {
  readonly initialArea: number;
  readonly finalArea: number;
  readonly areaIncrement: number;
  readonly linearApproximation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    diameterIncrement: { type: "number" },
  },
  required: ["diameter", "diameterIncrement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialArea: { type: "number" },
    finalArea: { type: "number" },
    areaIncrement: { type: "number" },
    linearApproximation: { type: "number" },
  },
  required: [
    "initialArea",
    "finalArea",
    "areaIncrement",
    "linearApproximation",
  ],
} as const;
/** Exact circular basal-area increment and its first-order diameter approximation in matching length units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, diameterIncrement } = request;
  const compute = (): Output => {
    H.domain(diameter >= 0 && diameter + diameterIncrement >= 0);
    return {
      initialArea: (Math.PI * diameter ** 2) / 4,
      finalArea: (Math.PI * (diameter + diameterIncrement) ** 2) / 4,
      areaIncrement:
        (Math.PI *
          (2 * diameter * diameterIncrement + diameterIncrement ** 2)) /
        4,
      linearApproximation: (Math.PI * diameter * diameterIncrement) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 10, diameterIncrement: 2 },
  output: {
    initialArea: 78.53981633974483,
    finalArea: 113.09733552923255,
    areaIncrement: 34.55751918948772,
    linearApproximation: 31.41592653589793,
  },
} satisfies ToolExample<Input, Output>;
export const treeBasalAreaDiameterSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/tree-basal-area-diameter-sensitivity",
    title: "Tree Basal Area Diameter Sensitivity Tool",
    description:
      "Exact circular basal-area increment and its first-order diameter approximation in matching length units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        diameterIncrement: { type: "number" },
      },
      required: ["diameter", "diameterIncrement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialArea: { type: "number" },
        finalArea: { type: "number" },
        areaIncrement: { type: "number" },
        linearApproximation: { type: "number" },
      },
      required: [
        "initialArea",
        "finalArea",
        "areaIncrement",
        "linearApproximation",
      ],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diameterIncrement",
          label: "Diameter Increment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "initialArea",
          label: "Initial Area",
          valueType: { type: "number" },
        },
        { id: "finalArea", label: "Final Area", valueType: { type: "number" } },
        {
          id: "areaIncrement",
          label: "Area Increment",
          valueType: { type: "number" },
        },
        {
          id: "linearApproximation",
          label: "Linear Approximation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeBasalAreaDiameterSensitivityTool.execute;
export default treeBasalAreaDiameterSensitivityTool;
