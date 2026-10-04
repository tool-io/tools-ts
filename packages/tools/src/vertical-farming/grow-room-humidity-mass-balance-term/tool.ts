import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMoisture: number;
  readonly evaporation: number;
  readonly ventilationRemoval: number;
  readonly condensation: number;
};
export type Output = { readonly netMoistureChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMoisture: { type: "number", minimum: 0 },
    evaporation: { type: "number", minimum: 0 },
    ventilationRemoval: { type: "number", minimum: 0 },
    condensation: { type: "number", minimum: 0 },
  },
  required: [
    "inputMoisture",
    "evaporation",
    "ventilationRemoval",
    "condensation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netMoistureChange: { type: "number" } },
  required: ["netMoistureChange"],
} as const;
/** Calculate grow room humidity mass balance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMoisture, evaporation, ventilationRemoval, condensation } =
    request;
  const compute = (): Output => {
    H.domain(
      inputMoisture >= 0 &&
        evaporation >= 0 &&
        ventilationRemoval >= 0 &&
        condensation >= 0,
    );
    return {
      netMoistureChange:
        inputMoisture + evaporation - ventilationRemoval - condensation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputMoisture: 2,
    evaporation: 5,
    ventilationRemoval: 3,
    condensation: 1,
  },
  output: { netMoistureChange: 3 },
} satisfies ToolExample<Input, Output>;
export const growRoomHumidityMassBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/grow-room-humidity-mass-balance-term",
    title: "Grow Room Humidity Mass Balance Term Tool",
    description:
      "Calculate grow room humidity mass balance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMoisture: { type: "number", minimum: 0 },
        evaporation: { type: "number", minimum: 0 },
        ventilationRemoval: { type: "number", minimum: 0 },
        condensation: { type: "number", minimum: 0 },
      },
      required: [
        "inputMoisture",
        "evaporation",
        "ventilationRemoval",
        "condensation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netMoistureChange: { type: "number" } },
      required: ["netMoistureChange"],
    },
    ports: {
      inputs: [
        {
          id: "inputMoisture",
          label: "Input Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporation",
          label: "Evaporation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ventilationRemoval",
          label: "Ventilation Removal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "condensation",
          label: "Condensation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netMoistureChange",
          label: "Net Moisture Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growRoomHumidityMassBalanceTermTool.execute;
export default growRoomHumidityMassBalanceTermTool;
