import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedVolume: number;
  readonly availablePorosity: number;
  readonly initialLiquid: number;
  readonly flow: number;
};
export type Output = {
  readonly fillVolume: number;
  readonly nominalTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedVolume: { type: "number", minimum: 0 },
    availablePorosity: { type: "number", minimum: 0, maximum: 1 },
    initialLiquid: { type: "number", minimum: 0 },
    flow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bedVolume", "availablePorosity", "initialLiquid", "flow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fillVolume: { type: "number" },
    nominalTime: { type: "number" },
  },
  required: ["fillVolume", "nominalTime"],
} as const;
/** Calculate aquaponic growbed flood time flow factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedVolume, availablePorosity, initialLiquid, flow } = request;
  const compute = (): Output => {
    H.probability(availablePorosity);
    H.positive(flow);
    H.domain(
      bedVolume >= 0 &&
        initialLiquid >= 0 &&
        initialLiquid <= bedVolume * availablePorosity,
    );
    return {
      fillVolume: bedVolume * availablePorosity - initialLiquid,
      nominalTime: (bedVolume * availablePorosity - initialLiquid) / flow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedVolume: 100, availablePorosity: 0.4, initialLiquid: 10, flow: 5 },
  output: { fillVolume: 30, nominalTime: 6 },
} satisfies ToolExample<Input, Output>;
export const aquaponicGrowbedFloodTimeFlowFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-growbed-flood-time-flow-factor",
      title: "Aquaponic Growbed Flood Time Flow Factor Tool",
      description:
        "Calculate aquaponic growbed flood time flow factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bedVolume: { type: "number", minimum: 0 },
          availablePorosity: { type: "number", minimum: 0, maximum: 1 },
          initialLiquid: { type: "number", minimum: 0 },
          flow: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["bedVolume", "availablePorosity", "initialLiquid", "flow"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fillVolume: { type: "number" },
          nominalTime: { type: "number" },
        },
        required: ["fillVolume", "nominalTime"],
      },
      ports: {
        inputs: [
          {
            id: "bedVolume",
            label: "Bed Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availablePorosity",
            label: "Available Porosity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialLiquid",
            label: "Initial Liquid",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "flow",
            label: "Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fillVolume",
            label: "Fill Volume",
            valueType: { type: "number" },
          },
          {
            id: "nominalTime",
            label: "Nominal Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicGrowbedFloodTimeFlowFactorTool.execute;
export default aquaponicGrowbedFloodTimeFlowFactorTool;
