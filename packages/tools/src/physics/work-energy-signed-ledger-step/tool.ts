import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialKineticEnergyJoules: number;
  readonly netWorkJoules: number;
};
export type Output = { readonly finalKineticEnergyJoules: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialKineticEnergyJoules: { type: "number", minimum: 0 },
    netWorkJoules: { type: "number" },
  },
  required: ["initialKineticEnergyJoules", "netWorkJoules"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { finalKineticEnergyJoules: { type: "number" } },
  required: ["finalKineticEnergyJoules"],
} as const;
/** Apply the work-energy theorem for one step, rejecting a negative resulting kinetic energy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialKineticEnergyJoules, netWorkJoules } = request;
  const compute = (): Output => {
    H.domain(
      initialKineticEnergyJoules >= 0 &&
        initialKineticEnergyJoules + netWorkJoules >= 0,
      "initialKineticEnergyJoules",
    );
    return {
      finalKineticEnergyJoules: initialKineticEnergyJoules + netWorkJoules,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialKineticEnergyJoules: 100, netWorkJoules: -25 },
  output: { finalKineticEnergyJoules: 75 },
} satisfies ToolExample<Input, Output>;
export const workEnergySignedLedgerStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/work-energy-signed-ledger-step",
    title: "Work Energy Signed Ledger Step Tool",
    description:
      "Apply the work-energy theorem for one step, rejecting a negative resulting kinetic energy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialKineticEnergyJoules: { type: "number", minimum: 0 },
        netWorkJoules: { type: "number" },
      },
      required: ["initialKineticEnergyJoules", "netWorkJoules"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { finalKineticEnergyJoules: { type: "number" } },
      required: ["finalKineticEnergyJoules"],
    },
    ports: {
      inputs: [
        {
          id: "initialKineticEnergyJoules",
          label: "Initial Kinetic Energy Joules",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "netWorkJoules",
          label: "Net Work Joules",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finalKineticEnergyJoules",
          label: "Final Kinetic Energy Joules",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workEnergySignedLedgerStepTool.execute;
export default workEnergySignedLedgerStepTool;
