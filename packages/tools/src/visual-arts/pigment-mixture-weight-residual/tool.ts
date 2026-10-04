import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMass: number;
  readonly componentMasses: readonly number[];
  readonly suppliedTare: number;
};
export type Output = {
  readonly componentTotal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMass: { type: "number", minimum: 0 },
    componentMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedTare: { type: "number", minimum: 0 },
  },
  required: ["totalMass", "componentMasses", "suppliedTare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentTotal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["componentTotal", "residual"],
} as const;
/** Supplied pigment mass ledger without material compatibility or mixing instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMass, componentMasses, suppliedTare } = request;
  const compute = (): Output => {
    H.domain(
      totalMass >= 0 &&
        suppliedTare >= 0 &&
        componentMasses.every((x) => x >= 0),
    );
    return {
      componentTotal: componentMasses.reduce((a, b) => a + b, 0),
      residual:
        totalMass - suppliedTare - componentMasses.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMass: 100, componentMasses: [30, 40, 20], suppliedTare: 5 },
  output: { componentTotal: 90, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const pigmentMixtureWeightResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/pigment-mixture-weight-residual",
    title: "Pigment Mixture Weight Residual Tool",
    description:
      "Supplied pigment mass ledger without material compatibility or mixing instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMass: { type: "number", minimum: 0 },
        componentMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedTare: { type: "number", minimum: 0 },
      },
      required: ["totalMass", "componentMasses", "suppliedTare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentTotal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["componentTotal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentMasses",
          label: "Component Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedTare",
          label: "Supplied Tare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentTotal",
          label: "Component Total",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pigmentMixtureWeightResidualTool.execute;
export default pigmentMixtureWeightResidualTool;
