import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentVolumes: readonly number[];
  readonly finalVolume: number;
  readonly contractionVolume: number;
  readonly withdrawn: number;
};
export type Output = {
  readonly sumComponents: number;
  readonly expectedFinal: number;
  readonly residual: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    finalVolume: { type: "number", minimum: 0 },
    contractionVolume: { type: "number", minimum: 0 },
    withdrawn: { type: "number", minimum: 0 },
  },
  required: [
    "componentVolumes",
    "finalVolume",
    "contractionVolume",
    "withdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumComponents: { type: "number" },
    expectedFinal: { type: "number" },
    residual: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["sumComponents", "expectedFinal", "residual", "remaining"],
} as const;
/** Reconcile supplied volume observations without reagent preparation instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentVolumes, finalVolume, contractionVolume, withdrawn } =
    request;
  const compute = (): Output => {
    H.domain(
      componentVolumes.every((x) => x >= 0) &&
        finalVolume >= 0 &&
        contractionVolume >= 0 &&
        withdrawn >= 0 &&
        withdrawn <= finalVolume,
    );
    return {
      sumComponents: componentVolumes.reduce((a, b) => a + b, 0),
      expectedFinal:
        componentVolumes.reduce((a, b) => a + b, 0) - contractionVolume,
      residual:
        finalVolume -
        componentVolumes.reduce((a, b) => a + b, 0) +
        contractionVolume,
      remaining: finalVolume - withdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentVolumes: [20, 30],
    finalVolume: 48,
    contractionVolume: 2,
    withdrawn: 5,
  },
  output: { sumComponents: 50, expectedFinal: 48, residual: 0, remaining: 43 },
} satisfies ToolExample<Input, Output>;
export const glpReagentPreparationVolumeReconcileTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "glp/glp-reagent-preparation-volume-reconcile",
      title: "GLP Reagent Preparation Volume Reconcile Tool",
      description:
        "Reconcile supplied volume observations without reagent preparation instructions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          componentVolumes: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          finalVolume: { type: "number", minimum: 0 },
          contractionVolume: { type: "number", minimum: 0 },
          withdrawn: { type: "number", minimum: 0 },
        },
        required: [
          "componentVolumes",
          "finalVolume",
          "contractionVolume",
          "withdrawn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sumComponents: { type: "number" },
          expectedFinal: { type: "number" },
          residual: { type: "number" },
          remaining: { type: "number" },
        },
        required: ["sumComponents", "expectedFinal", "residual", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "componentVolumes",
            label: "Component Volumes",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "finalVolume",
            label: "Final Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contractionVolume",
            label: "Contraction Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sumComponents",
            label: "Sum Components",
            valueType: { type: "number" },
          },
          {
            id: "expectedFinal",
            label: "Expected Final",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = glpReagentPreparationVolumeReconcileTool.execute;
export default glpReagentPreparationVolumeReconcileTool;
