import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacitanceFarads: number;
  readonly terminalAVolts: number;
  readonly terminalBVolts: number;
  readonly reportTerminalA: boolean;
};
export type Output = { readonly reportedChargeCoulombs: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitanceFarads: { type: "number", minimum: 0 },
    terminalAVolts: { type: "number" },
    terminalBVolts: { type: "number" },
    reportTerminalA: { type: "boolean" },
  },
  required: [
    "capacitanceFarads",
    "terminalAVolts",
    "terminalBVolts",
    "reportTerminalA",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reportedChargeCoulombs: { type: "number" } },
  required: ["reportedChargeCoulombs"],
} as const;
/** Calculate ideal capacitor terminal charge from explicit capacitance and terminal potentials under a supplied terminal sign reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitanceFarads, terminalAVolts, terminalBVolts, reportTerminalA } =
    request;
  const compute = (): Output => {
    H.domain(capacitanceFarads >= 0, "capacitanceFarads");
    return {
      reportedChargeCoulombs:
        capacitanceFarads *
        (terminalAVolts - terminalBVolts) *
        (reportTerminalA ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    capacitanceFarads: 0.002,
    terminalAVolts: 12,
    terminalBVolts: 2,
    reportTerminalA: true,
  },
  output: { reportedChargeCoulombs: 0.02 },
} satisfies ToolExample<Input, Output>;
export const capacitorChargeSignReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electricity", "engineering"],
      keywords: ["electricity", "engineering"],
    },
    id: "electricity/capacitor-charge-sign-reference",
    title: "Capacitor Charge Sign Reference",
    description:
      "Calculate ideal capacitor terminal charge from explicit capacitance and terminal potentials under a supplied terminal sign reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitanceFarads: { type: "number", minimum: 0 },
        terminalAVolts: { type: "number" },
        terminalBVolts: { type: "number" },
        reportTerminalA: { type: "boolean" },
      },
      required: [
        "capacitanceFarads",
        "terminalAVolts",
        "terminalBVolts",
        "reportTerminalA",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reportedChargeCoulombs: { type: "number" } },
      required: ["reportedChargeCoulombs"],
    },
    ports: {
      inputs: [
        {
          id: "capacitanceFarads",
          label: "Capacitance Farads",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "terminalAVolts",
          label: "Terminal AVolts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "terminalBVolts",
          label: "Terminal BVolts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportTerminalA",
          label: "Report Terminal A",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedChargeCoulombs",
          label: "Reported Charge Coulombs",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capacitorChargeSignReferenceTool.execute;
export default capacitorChargeSignReferenceTool;
