import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentAccumulation: number;
  readonly precedingAccumulation: number;
  readonly resetOccurred: boolean;
  readonly resetBase: number;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentAccumulation: { type: "number" },
    precedingAccumulation: { type: "number" },
    resetOccurred: { type: "boolean" },
    resetBase: { type: "number" },
  },
  required: [
    "currentAccumulation",
    "precedingAccumulation",
    "resetOccurred",
    "resetBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "number" } },
  required: ["increment"],
} as const;
/** Difference an explicit forcing accumulation under a caller-supplied reset flag and reset base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    currentAccumulation,
    precedingAccumulation,
    resetOccurred,
    resetBase,
  } = request;
  const compute = (): Output => {
    return {
      increment: resetOccurred
        ? currentAccumulation - resetBase
        : currentAccumulation - precedingAccumulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentAccumulation: 18,
    precedingAccumulation: 12,
    resetOccurred: false,
    resetBase: 0,
  },
  output: { increment: 6 },
} satisfies ToolExample<Input, Output>;
export const weatherForcingAccumulationOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/weather-forcing-accumulation-offset",
    title: "Weather Forcing Accumulation Offset",
    description:
      "Difference an explicit forcing accumulation under a caller-supplied reset flag and reset base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentAccumulation: { type: "number" },
        precedingAccumulation: { type: "number" },
        resetOccurred: { type: "boolean" },
        resetBase: { type: "number" },
      },
      required: [
        "currentAccumulation",
        "precedingAccumulation",
        "resetOccurred",
        "resetBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { increment: { type: "number" } },
      required: ["increment"],
    },
    ports: {
      inputs: [
        {
          id: "currentAccumulation",
          label: "Current Accumulation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "precedingAccumulation",
          label: "Preceding Accumulation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetOccurred",
          label: "Reset Occurred",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "resetBase",
          label: "Reset Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = weatherForcingAccumulationOffsetTool.execute;
export default weatherForcingAccumulationOffsetTool;
