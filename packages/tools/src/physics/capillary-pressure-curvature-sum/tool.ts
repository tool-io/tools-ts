import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceTension: number;
  readonly firstCurvature: number;
  readonly secondCurvature: number;
};
export type Output = { readonly pressureJump: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceTension: { type: "number", minimum: 0 },
    firstCurvature: { type: "number" },
    secondCurvature: { type: "number" },
  },
  required: ["surfaceTension", "firstCurvature", "secondCurvature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pressureJump: { type: "number" } },
  required: ["pressureJump"],
} as const;
/** Apply Young-Laplace pressure with explicitly signed principal curvatures and a caller-chosen normal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceTension, firstCurvature, secondCurvature } = request;
  const compute = (): Output => {
    H.domain(surfaceTension >= 0);
    return {
      pressureJump: surfaceTension * (firstCurvature + secondCurvature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surfaceTension: 0.072, firstCurvature: 1000, secondCurvature: 1000 },
  output: { pressureJump: 144 },
} satisfies ToolExample<Input, Output>;
export const capillaryPressureCurvatureSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/capillary-pressure-curvature-sum",
    title: "Capillary Pressure Curvature Sum Tool",
    description:
      "Apply Young-Laplace pressure with explicitly signed principal curvatures and a caller-chosen normal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceTension: { type: "number", minimum: 0 },
        firstCurvature: { type: "number" },
        secondCurvature: { type: "number" },
      },
      required: ["surfaceTension", "firstCurvature", "secondCurvature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pressureJump: { type: "number" } },
      required: ["pressureJump"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceTension",
          label: "Surface Tension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstCurvature",
          label: "First Curvature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCurvature",
          label: "Second Curvature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pressureJump",
          label: "Pressure Jump",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capillaryPressureCurvatureSumTool.execute;
export default capillaryPressureCurvatureSumTool;
