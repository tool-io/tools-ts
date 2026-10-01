import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordSerial: string;
  readonly labelSerial: string;
  readonly recordLot: string;
  readonly labelLot: string;
  readonly recordSource: string;
  readonly labelSource: string;
};
export type Output = {
  readonly serialMatch: boolean;
  readonly lotMatch: boolean;
  readonly sourceMatch: boolean;
  readonly allMatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordSerial: { type: "string", maxLength: 8192 },
    labelSerial: { type: "string", maxLength: 8192 },
    recordLot: { type: "string", maxLength: 8192 },
    labelLot: { type: "string", maxLength: 8192 },
    recordSource: { type: "string", maxLength: 8192 },
    labelSource: { type: "string", maxLength: 8192 },
  },
  required: [
    "recordSerial",
    "labelSerial",
    "recordLot",
    "labelLot",
    "recordSource",
    "labelSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serialMatch: { type: "boolean" },
    lotMatch: { type: "boolean" },
    sourceMatch: { type: "boolean" },
    allMatch: { type: "boolean" },
  },
  required: ["serialMatch", "lotMatch", "sourceMatch", "allMatch"],
} as const;
/** Compare explicit device serial, lot and source labels exactly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordSerial,
    labelSerial,
    recordLot,
    labelLot,
    recordSource,
    labelSource,
  } = request;
  const compute = (): Output => {
    H.domain(
      [
        recordSerial,
        labelSerial,
        recordLot,
        labelLot,
        recordSource,
        labelSource,
      ].every((x) => x.length > 0),
    );
    const serialMatch = recordSerial === labelSerial,
      lotMatch = recordLot === labelLot,
      sourceMatch = recordSource === labelSource;
    return {
      serialMatch,
      lotMatch,
      sourceMatch,
      allMatch: serialMatch && lotMatch && sourceMatch,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordSerial: "001",
    labelSerial: "001",
    recordLot: "L1",
    labelLot: "L1",
    recordSource: "A",
    labelSource: "A",
  },
  output: {
    serialMatch: true,
    lotMatch: true,
    sourceMatch: true,
    allMatch: true,
  },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryDeviceSerialSourceCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/oral-surgery-device-serial-source-check",
    title: "Oral Surgery Device Serial Source Check Tool",
    description:
      "Compare explicit device serial, lot and source labels exactly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordSerial: { type: "string", maxLength: 8192 },
        labelSerial: { type: "string", maxLength: 8192 },
        recordLot: { type: "string", maxLength: 8192 },
        labelLot: { type: "string", maxLength: 8192 },
        recordSource: { type: "string", maxLength: 8192 },
        labelSource: { type: "string", maxLength: 8192 },
      },
      required: [
        "recordSerial",
        "labelSerial",
        "recordLot",
        "labelLot",
        "recordSource",
        "labelSource",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serialMatch: { type: "boolean" },
        lotMatch: { type: "boolean" },
        sourceMatch: { type: "boolean" },
        allMatch: { type: "boolean" },
      },
      required: ["serialMatch", "lotMatch", "sourceMatch", "allMatch"],
    },
    ports: {
      inputs: [
        {
          id: "recordSerial",
          label: "Record Serial",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelSerial",
          label: "Label Serial",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordLot",
          label: "Record Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelLot",
          label: "Label Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordSource",
          label: "Record Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelSource",
          label: "Label Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "serialMatch",
          label: "Serial Match",
          valueType: { type: "boolean" },
        },
        { id: "lotMatch", label: "Lot Match", valueType: { type: "boolean" } },
        {
          id: "sourceMatch",
          label: "Source Match",
          valueType: { type: "boolean" },
        },
        { id: "allMatch", label: "All Match", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = oralSurgeryDeviceSerialSourceCheckTool.execute;
export default oralSurgeryDeviceSerialSourceCheckTool;
