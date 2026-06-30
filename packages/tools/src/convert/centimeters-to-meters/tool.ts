import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { convertLengthByFactors } from "../length/calculation.js";

export type CentimetersToMetersInput = {
  readonly centimeters: number;
};

export type CentimetersToMetersOutput = {
  readonly meters: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const convertCentimetersToMeters = (
  input: unknown,
): ToolResult<CentimetersToMetersOutput> => {
  if (
    !isRecord(input) ||
    typeof input.centimeters !== "number" ||
    !Number.isFinite(input.centimeters) ||
    Object.keys(input).some((field) => field !== "centimeters")
  )
    return invalidInput([
      {
        code: "finite_centimeters_required",
        field: "centimeters",
        message: "Centimeters must be a finite number.",
      },
    ]);

  return toolSuccess({
    meters: convertLengthByFactors(input.centimeters, 0.01, 1),
  });
};

export const centimetersToMetersTool = defineTool<
  CentimetersToMetersInput,
  CentimetersToMetersOutput
>({
  contractVersion: 1,
  description: "Convert a finite length from centimeters to meters.",
  execute: convertCentimetersToMeters,
  execution: { kind: "pure" },
  id: "convert/centimeters-to-meters",
  inputSchema: {
    additionalProperties: false,
    properties: { centimeters: { type: "number" } },
    required: ["centimeters"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { meters: { type: "number" } },
    required: ["meters"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "centimeters",
        label: "Centimeters",
        required: true,
        valueType: { format: "length", type: "number", unit: "cm" },
      },
    ],
    outputs: [
      {
        id: "meters",
        label: "Meters",
        valueType: { format: "length", type: "number", unit: "m" },
      },
    ],
  },
  title: "Centimeters to Meters",
});

export default centimetersToMetersTool;
