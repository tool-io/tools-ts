import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forceComponent: number;
  readonly displacementComponent: number;
};
export type Output = {
  readonly linearizedEnergyChange: number;
  readonly downhill: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forceComponent: { type: "number" },
    displacementComponent: { type: "number" },
  },
  required: ["forceComponent", "displacementComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearizedEnergyChange: { type: "number" },
    downhill: { type: "boolean" },
  },
  required: ["linearizedEnergyChange", "downhill"],
} as const;
/** Return one first-order potential-energy change contribution -F·dx from explicit force and displacement components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forceComponent, displacementComponent } = request;
  const compute = (): Output => {
    return {
      linearizedEnergyChange: -forceComponent * displacementComponent,
      downhill: forceComponent * displacementComponent > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forceComponent: 2, displacementComponent: 0.1 },
  output: { linearizedEnergyChange: -0.2, downhill: true },
} satisfies ToolExample<Input, Output>;
export const geometryStepForceEnergySignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/geometry-step-force-energy-sign",
    title: "Geometry Step Force Energy Sign",
    description:
      "Return one first-order potential-energy change contribution -F·dx from explicit force and displacement components.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forceComponent: { type: "number" },
        displacementComponent: { type: "number" },
      },
      required: ["forceComponent", "displacementComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearizedEnergyChange: { type: "number" },
        downhill: { type: "boolean" },
      },
      required: ["linearizedEnergyChange", "downhill"],
    },
    ports: {
      inputs: [
        {
          id: "forceComponent",
          label: "Force Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacementComponent",
          label: "Displacement Component",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linearizedEnergyChange",
          label: "Linearized Energy Change",
          valueType: { type: "number" },
        },
        { id: "downhill", label: "Downhill", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = geometryStepForceEnergySignTool.execute;
export default geometryStepForceEnergySignTool;
