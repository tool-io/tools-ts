import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ppfd: number;
  readonly hours: number;
  readonly dutyFraction: number;
};
export type Output = { readonly dliMolesPerM2: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ppfd: { type: "number", minimum: 0 },
    hours: { type: "number", minimum: 0, maximum: 24 },
    dutyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["ppfd", "hours", "dutyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dliMolesPerM2: { type: "number" } },
  required: ["dliMolesPerM2"],
} as const;
/** Integrate a constant on-state PPFD over up to 24 hours with a supplied duty fraction; PPFD is in micromoles per square meter per second. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ppfd, hours, dutyFraction } = request;
  const compute = (): Output => {
    H.domain(ppfd >= 0 && hours >= 0 && hours <= 24);
    H.probability(dutyFraction);
    return { dliMolesPerM2: (ppfd * hours * dutyFraction * 3600) / 1e6 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ppfd: 200, hours: 16, dutyFraction: 0.5 },
  output: { dliMolesPerM2: 5.76 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmLightDliDutyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/vertical-farm-light-dli-duty-factor",
    title: "Vertical Farm Light DLI Duty Factor Tool",
    description:
      "Integrate a constant on-state PPFD over up to 24 hours with a supplied duty fraction; PPFD is in micromoles per square meter per second.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ppfd: { type: "number", minimum: 0 },
        hours: { type: "number", minimum: 0, maximum: 24 },
        dutyFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["ppfd", "hours", "dutyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dliMolesPerM2: { type: "number" } },
      required: ["dliMolesPerM2"],
    },
    ports: {
      inputs: [
        {
          id: "ppfd",
          label: "Ppfd",
          required: true,
          valueType: { type: "number", unit: "umol/(m2*s)" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "dutyFraction",
          label: "Duty Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "dliMolesPerM2",
          label: "Dli Moles Per M2",
          valueType: { type: "number", unit: "mol/m2" },
        },
      ],
    },
  },
  calculate,
});
export const run = verticalFarmLightDliDutyFactorTool.execute;
export default verticalFarmLightDliDutyFactorTool;
