import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly beta: number; readonly input: number };
export type Output = {
  readonly peakCurvatureLocation: number;
  readonly atPeak: boolean;
  readonly peakCurvature: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beta: { type: "number", exclusiveMinimum: 0 },
    input: { type: "number" },
  },
  required: ["beta", "input"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    peakCurvatureLocation: { type: "number" },
    atPeak: { type: "boolean" },
    peakCurvature: { type: "number" },
  },
  required: ["peakCurvatureLocation", "atPeak", "peakCurvature"],
} as const;
/** For softplus log(1+exp(beta*x))/beta, locate its curvature maximum; the function has no curvature sign-change inflection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beta, input } = request;
  const compute = (): Output => {
    H.positive(beta);
    return {
      peakCurvatureLocation: 0,
      atPeak: input === 0,
      peakCurvature: beta / 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beta: 2, input: 0 },
  output: { peakCurvatureLocation: 0, atPeak: true, peakCurvature: 0.5 },
} satisfies ToolExample<Input, Output>;
export const softplusCurvatureInflectionLocationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "activation/softplus-curvature-inflection-location",
      title: "Softplus Curvature Inflection Location Tool",
      description:
        "For softplus log(1+exp(beta*x))/beta, locate its curvature maximum; the function has no curvature sign-change inflection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          beta: { type: "number", exclusiveMinimum: 0 },
          input: { type: "number" },
        },
        required: ["beta", "input"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          peakCurvatureLocation: { type: "number" },
          atPeak: { type: "boolean" },
          peakCurvature: { type: "number" },
        },
        required: ["peakCurvatureLocation", "atPeak", "peakCurvature"],
      },
      ports: {
        inputs: [
          {
            id: "beta",
            label: "Beta",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "input",
            label: "Input",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "peakCurvatureLocation",
            label: "Peak Curvature Location",
            valueType: { type: "number" },
          },
          { id: "atPeak", label: "At Peak", valueType: { type: "boolean" } },
          {
            id: "peakCurvature",
            label: "Peak Curvature",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = softplusCurvatureInflectionLocationTool.execute;
export default softplusCurvatureInflectionLocationTool;
