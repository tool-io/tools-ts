import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly power: number };
export type Output = {
  readonly integrable: boolean;
  readonly logarithmicBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { power: { type: "number" } },
  required: ["power"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integrable: { type: "boolean" },
    logarithmicBoundary: { type: "boolean" },
  },
  required: ["integrable", "logarithmicBoundary"],
} as const;
/** Test local integrability of x^power at zero on a positive finite interval. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { power } = input;
  const compute = (): Output => {
    return { integrable: power > -1, logarithmicBoundary: power === -1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { power: -0.5 },
  output: { integrable: true, logarithmicBoundary: false },
} satisfies ToolExample<Input, Output>;
export const endpointSingularityIntegrabilityPowerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "calculus/endpoint-singularity-integrability-power",
      title: "Endpoint Singularity Integrability Power Tool",
      description:
        "Test local integrability of x^power at zero on a positive finite interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { power: { type: "number" } },
        required: ["power"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          integrable: { type: "boolean" },
          logarithmicBoundary: { type: "boolean" },
        },
        required: ["integrable", "logarithmicBoundary"],
      },
      ports: {
        inputs: [
          {
            id: "power",
            label: "Power",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "integrable",
            label: "Integrable",
            valueType: { type: "boolean" },
          },
          {
            id: "logarithmicBoundary",
            label: "Logarithmic Boundary",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = endpointSingularityIntegrabilityPowerTool.execute;
export default endpointSingularityIntegrabilityPowerTool;
