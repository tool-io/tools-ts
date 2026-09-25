import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialLength: number;
  readonly suppliedFractionalContraction: number;
  readonly measuredFinalLength: number;
};
export type Output = {
  readonly predictedFinal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialLength: { type: "number", minimum: 0 },
    suppliedFractionalContraction: { type: "number", maximum: 1 },
    measuredFinalLength: { type: "number", minimum: 0 },
  },
  required: [
    "initialLength",
    "suppliedFractionalContraction",
    "measuredFinalLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedFinal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["predictedFinal", "residual"],
} as const;
/** Compare a supplied integrated contraction fraction with a measured bench length; negative contraction denotes expansion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialLength, suppliedFractionalContraction, measuredFinalLength } =
    request;
  const compute = (): Output => {
    H.domain(
      initialLength >= 0 &&
        suppliedFractionalContraction <= 1 &&
        measuredFinalLength >= 0,
    );
    return {
      predictedFinal: initialLength * (1 - suppliedFractionalContraction),
      residual:
        measuredFinalLength -
        initialLength * (1 - suppliedFractionalContraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialLength: 100,
    suppliedFractionalContraction: 0.01,
    measuredFinalLength: 98,
  },
  output: { predictedFinal: 99, residual: -1 },
} satisfies ToolExample<Input, Output>;
export const thermalContractionFitResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/thermal-contraction-fit-residual",
    title: "Thermal Contraction Fit Residual Tool",
    description:
      "Compare a supplied integrated contraction fraction with a measured bench length; negative contraction denotes expansion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialLength: { type: "number", minimum: 0 },
        suppliedFractionalContraction: { type: "number", maximum: 1 },
        measuredFinalLength: { type: "number", minimum: 0 },
      },
      required: [
        "initialLength",
        "suppliedFractionalContraction",
        "measuredFinalLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedFinal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["predictedFinal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "initialLength",
          label: "Initial Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFractionalContraction",
          label: "Supplied Fractional Contraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFinalLength",
          label: "Measured Final Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedFinal",
          label: "Predicted Final",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = thermalContractionFitResidualTool.execute;
export default thermalContractionFitResidualTool;
