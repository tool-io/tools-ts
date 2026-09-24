import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mobility: number;
  readonly electricField: number;
};
export type Output = { readonly driftVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mobility: { type: "number" },
    electricField: { type: "number" },
  },
  required: ["mobility", "electricField"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { driftVelocity: { type: "number" } },
  required: ["driftVelocity"],
} as const;
/** Apply signed mobility in square metres per volt second to a signed electric field in volts per metre. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mobility, electricField } = input;
  const compute = (): Output => {
    return { driftVelocity: mobility * electricField };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mobility: 0.02, electricField: -100 },
  output: { driftVelocity: -2 },
} satisfies ToolExample<Input, Output>;
export const electricMobilityDriftSpeedFieldFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/electric-mobility-drift-speed-field-factor",
      title: "Electric Mobility Drift Speed Field Factor Tool",
      description:
        "Apply signed mobility in square metres per volt second to a signed electric field in volts per metre.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mobility: { type: "number" },
          electricField: { type: "number" },
        },
        required: ["mobility", "electricField"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { driftVelocity: { type: "number" } },
        required: ["driftVelocity"],
      },
      ports: {
        inputs: [
          {
            id: "mobility",
            label: "Mobility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "electricField",
            label: "Electric Field",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "driftVelocity",
            label: "Drift Velocity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electricMobilityDriftSpeedFieldFactorTool.execute;
export default electricMobilityDriftSpeedFieldFactorTool;
