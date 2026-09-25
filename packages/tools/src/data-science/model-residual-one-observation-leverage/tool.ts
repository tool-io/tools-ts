import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residual: number;
  readonly leverage: number;
  readonly residualSd: number;
};
export type Output = {
  readonly pressResidual: number;
  readonly internallyStudentized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    leverage: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    residualSd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["residual", "leverage", "residualSd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressResidual: { type: "number" },
    internallyStudentized: { type: "number" },
  },
  required: ["pressResidual", "internallyStudentized"],
} as const;
/** Calculate model residual one observation leverage from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residual, leverage, residualSd } = request;
  const compute = (): Output => {
    H.domain(leverage >= 0 && leverage < 1);
    H.positive(residualSd);
    return {
      pressResidual: residual / (1 - leverage),
      internallyStudentized: residual / residualSd / Math.sqrt(1 - leverage),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { residual: 3, leverage: 0.75, residualSd: 2 },
  output: { pressResidual: 12, internallyStudentized: 3 },
} satisfies ToolExample<Input, Output>;
export const modelResidualOneObservationLeverageTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "data-science/model-residual-one-observation-leverage",
      title: "Model Residual One Observation Leverage Tool",
      description:
        "Calculate model residual one observation leverage from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          leverage: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          residualSd: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["residual", "leverage", "residualSd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pressResidual: { type: "number" },
          internallyStudentized: { type: "number" },
        },
        required: ["pressResidual", "internallyStudentized"],
      },
      ports: {
        inputs: [
          {
            id: "residual",
            label: "Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leverage",
            label: "Leverage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "residualSd",
            label: "Residual Sd",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "pressResidual",
            label: "Press Residual",
            valueType: { type: "number" },
          },
          {
            id: "internallyStudentized",
            label: "Internally Studentized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = modelResidualOneObservationLeverageTool.execute;
export default modelResidualOneObservationLeverageTool;
