import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pumpHeadAtFlow: number;
  readonly systemHeadAtFlow: number;
};
export type Output = {
  readonly headResidual: number;
  readonly balancedExactly: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pumpHeadAtFlow: { type: "number" },
    systemHeadAtFlow: { type: "number" },
  },
  required: ["pumpHeadAtFlow", "systemHeadAtFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headResidual: { type: "number" },
    balancedExactly: { type: "boolean" },
  },
  required: ["headResidual", "balancedExactly"],
} as const;
/** Compare supplied pump and system head values evaluated at the same explicit flow point, without solving the full operating curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pumpHeadAtFlow, systemHeadAtFlow } = request;
  const compute = (): Output => {
    return {
      headResidual: pumpHeadAtFlow - systemHeadAtFlow,
      balancedExactly: pumpHeadAtFlow === systemHeadAtFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pumpHeadAtFlow: 25, systemHeadAtFlow: 20 },
  output: { headResidual: 5, balancedExactly: false },
} satisfies ToolExample<Input, Output>;
export const pumpCurveOperatingPointResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/pump-curve-operating-point-residual",
    title: "Pump Curve Operating Point Residual",
    description:
      "Compare supplied pump and system head values evaluated at the same explicit flow point, without solving the full operating curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pumpHeadAtFlow: { type: "number" },
        systemHeadAtFlow: { type: "number" },
      },
      required: ["pumpHeadAtFlow", "systemHeadAtFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headResidual: { type: "number" },
        balancedExactly: { type: "boolean" },
      },
      required: ["headResidual", "balancedExactly"],
    },
    ports: {
      inputs: [
        {
          id: "pumpHeadAtFlow",
          label: "Pump Head At Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "systemHeadAtFlow",
          label: "System Head At Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "headResidual",
          label: "Head Residual",
          valueType: { type: "number" },
        },
        {
          id: "balancedExactly",
          label: "Balanced Exactly",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pumpCurveOperatingPointResidualTool.execute;
export default pumpCurveOperatingPointResidualTool;
