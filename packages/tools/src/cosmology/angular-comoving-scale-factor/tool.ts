import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleRadians: number;
  readonly transverseComovingDistance: number;
};
export type Output = { readonly transverseComovingSize: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleRadians: { type: "number", minimum: 0 },
    transverseComovingDistance: { type: "number", minimum: 0 },
  },
  required: ["angleRadians", "transverseComovingDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transverseComovingSize: { type: "number" } },
  required: ["transverseComovingSize"],
} as const;
/** Apply the small-angle transverse comoving relation using an explicitly supplied distance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleRadians, transverseComovingDistance } = request;
  const compute = (): Output => {
    H.domain(angleRadians >= 0 && transverseComovingDistance >= 0);
    return {
      transverseComovingSize: angleRadians * transverseComovingDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleRadians: 0.001, transverseComovingDistance: 1000 },
  output: { transverseComovingSize: 1 },
} satisfies ToolExample<Input, Output>;
export const angularComovingScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/angular-comoving-scale-factor",
    title: "Angular Comoving Scale Factor Tool",
    description:
      "Apply the small-angle transverse comoving relation using an explicitly supplied distance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleRadians: { type: "number", minimum: 0 },
        transverseComovingDistance: { type: "number", minimum: 0 },
      },
      required: ["angleRadians", "transverseComovingDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transverseComovingSize: { type: "number" } },
      required: ["transverseComovingSize"],
    },
    ports: {
      inputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transverseComovingDistance",
          label: "Transverse Comoving Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transverseComovingSize",
          label: "Transverse Comoving Size",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = angularComovingScaleFactorTool.execute;
export default angularComovingScaleFactorTool;
