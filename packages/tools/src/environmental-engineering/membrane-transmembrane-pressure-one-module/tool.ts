import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedPressure: number;
  readonly retentatePressure: number;
  readonly permeatePressure: number;
  readonly osmoticDifference: number;
};
export type Output = {
  readonly tmp: number;
  readonly netDrivingPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedPressure: { type: "number" },
    retentatePressure: { type: "number" },
    permeatePressure: { type: "number" },
    osmoticDifference: { type: "number" },
  },
  required: [
    "feedPressure",
    "retentatePressure",
    "permeatePressure",
    "osmoticDifference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tmp: { type: "number" },
    netDrivingPressure: { type: "number" },
  },
  required: ["tmp", "netDrivingPressure"],
} as const;
/** Arithmetic-mean feed-side TMP with an explicit osmotic pressure difference; pressure units must match. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    feedPressure,
    retentatePressure,
    permeatePressure,
    osmoticDifference,
  } = request;
  const compute = (): Output => {
    return {
      tmp: (feedPressure + retentatePressure) / 2 - permeatePressure,
      netDrivingPressure:
        (feedPressure + retentatePressure) / 2 -
        permeatePressure -
        osmoticDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedPressure: 6,
    retentatePressure: 4,
    permeatePressure: 1,
    osmoticDifference: 2,
  },
  output: { tmp: 4, netDrivingPressure: 2 },
} satisfies ToolExample<Input, Output>;
export const membraneTransmembranePressureOneModuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/membrane-transmembrane-pressure-one-module",
      title: "Membrane Transmembrane Pressure One Module Tool",
      description:
        "Arithmetic-mean feed-side TMP with an explicit osmotic pressure difference; pressure units must match.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedPressure: { type: "number" },
          retentatePressure: { type: "number" },
          permeatePressure: { type: "number" },
          osmoticDifference: { type: "number" },
        },
        required: [
          "feedPressure",
          "retentatePressure",
          "permeatePressure",
          "osmoticDifference",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tmp: { type: "number" },
          netDrivingPressure: { type: "number" },
        },
        required: ["tmp", "netDrivingPressure"],
      },
      ports: {
        inputs: [
          {
            id: "feedPressure",
            label: "Feed Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retentatePressure",
            label: "Retentate Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permeatePressure",
            label: "Permeate Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "osmoticDifference",
            label: "Osmotic Difference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "tmp", label: "Tmp", valueType: { type: "number" } },
          {
            id: "netDrivingPressure",
            label: "Net Driving Pressure",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = membraneTransmembranePressureOneModuleTool.execute;
export default membraneTransmembranePressureOneModuleTool;
