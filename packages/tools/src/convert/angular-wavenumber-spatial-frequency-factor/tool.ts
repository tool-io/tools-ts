import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cyclesPerLength: number };
export type Output = { readonly radiansPerLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cyclesPerLength: { type: "number" } },
  required: ["cyclesPerLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiansPerLength: { type: "number" } },
  required: ["radiansPerLength"],
} as const;
/** Calculate angular wavenumber spatial frequency factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cyclesPerLength } = request;
  const compute = (): Output => {
    return { radiansPerLength: 2 * Math.PI * cyclesPerLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cyclesPerLength: 2 },
  output: { radiansPerLength: 12.566370614359172 },
} satisfies ToolExample<Input, Output>;
export const angularWavenumberSpatialFrequencyFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/angular-wavenumber-spatial-frequency-factor",
      title: "Angular Wavenumber Spatial Frequency Factor Tool",
      description:
        "Calculate angular wavenumber spatial frequency factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cyclesPerLength: { type: "number" } },
        required: ["cyclesPerLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { radiansPerLength: { type: "number" } },
        required: ["radiansPerLength"],
      },
      ports: {
        inputs: [
          {
            id: "cyclesPerLength",
            label: "Cycles Per Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "radiansPerLength",
            label: "Radians Per Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = angularWavenumberSpatialFrequencyFactorTool.execute;
export default angularWavenumberSpatialFrequencyFactorTool;
