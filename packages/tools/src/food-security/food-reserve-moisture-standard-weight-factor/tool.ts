import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moisture: number;
  readonly targetMoisture: number;
  readonly handlingLoss: number;
};
export type Output = {
  readonly dryMass: number;
  readonly standardMass: number;
  readonly netStandardMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    targetMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    handlingLoss: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetMass", "moisture", "targetMoisture", "handlingLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    standardMass: { type: "number" },
    netStandardMass: { type: "number" },
  },
  required: ["dryMass", "standardMass", "netStandardMass"],
} as const;
/** Calculate food reserve moisture standard weight factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moisture, targetMoisture, handlingLoss } = request;
  const compute = (): Output => {
    H.domain(
      wetMass >= 0 &&
        moisture >= 0 &&
        moisture < 1 &&
        targetMoisture >= 0 &&
        targetMoisture < 1,
    );
    H.probability(handlingLoss);
    return {
      dryMass: wetMass * (1 - moisture),
      standardMass: (wetMass * (1 - moisture)) / (1 - targetMoisture),
      netStandardMass:
        ((wetMass * (1 - moisture)) / (1 - targetMoisture)) *
        (1 - handlingLoss),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 100,
    moisture: 0.2,
    targetMoisture: 0.2,
    handlingLoss: 0.1,
  },
  output: { dryMass: 80, standardMass: 100, netStandardMass: 90 },
} satisfies ToolExample<Input, Output>;
export const foodReserveMoistureStandardWeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/food-reserve-moisture-standard-weight-factor",
      title: "Food Reserve Moisture Standard Weight Factor Tool",
      description:
        "Calculate food reserve moisture standard weight factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetMass: { type: "number", minimum: 0 },
          moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          targetMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          handlingLoss: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["wetMass", "moisture", "targetMoisture", "handlingLoss"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryMass: { type: "number" },
          standardMass: { type: "number" },
          netStandardMass: { type: "number" },
        },
        required: ["dryMass", "standardMass", "netStandardMass"],
      },
      ports: {
        inputs: [
          {
            id: "wetMass",
            label: "Wet Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "moisture",
            label: "Moisture",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetMoisture",
            label: "Target Moisture",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "handlingLoss",
            label: "Handling Loss",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
          {
            id: "standardMass",
            label: "Standard Mass",
            valueType: { type: "number" },
          },
          {
            id: "netStandardMass",
            label: "Net Standard Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodReserveMoistureStandardWeightFactorTool.execute;
export default foodReserveMoistureStandardWeightFactorTool;
