import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timeSeconds: number;
  readonly utcOffsetSeconds: number;
  readonly quantumSeconds: number;
  readonly offsetKnown: boolean;
};
export type Output = {
  readonly utcDefined: boolean;
  readonly utcLower: number;
  readonly utcUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeSeconds: { type: "number" },
    utcOffsetSeconds: { type: "number" },
    quantumSeconds: { type: "number", exclusiveMinimum: 0 },
    offsetKnown: { type: "boolean" },
  },
  required: [
    "timeSeconds",
    "utcOffsetSeconds",
    "quantumSeconds",
    "offsetKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utcDefined: { type: "boolean" },
    utcLower: { type: "number" },
    utcUpper: { type: "number" },
  },
  required: ["utcDefined", "utcLower", "utcUpper"],
} as const;
/** Preserve a truncated timestamp quantum and offset-known flag; unknown UTC values use flagged zero placeholders. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timeSeconds, utcOffsetSeconds, quantumSeconds, offsetKnown } =
    request;
  const compute = (): Output => {
    H.positive(quantumSeconds);
    return {
      utcDefined: offsetKnown,
      utcLower: offsetKnown ? timeSeconds - utcOffsetSeconds : 0,
      utcUpper: offsetKnown
        ? timeSeconds - utcOffsetSeconds + quantumSeconds
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    timeSeconds: 3600,
    utcOffsetSeconds: 1800,
    quantumSeconds: 60,
    offsetKnown: true,
  },
  output: { utcDefined: true, utcLower: 1800, utcUpper: 1860 },
} satisfies ToolExample<Input, Output>;
export const acquisitionTimeOffsetPrecisionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/acquisition-time-offset-precision-flag",
    title: "Acquisition Time Offset Precision Flag Tool",
    description:
      "Preserve a truncated timestamp quantum and offset-known flag; unknown UTC values use flagged zero placeholders.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeSeconds: { type: "number" },
        utcOffsetSeconds: { type: "number" },
        quantumSeconds: { type: "number", exclusiveMinimum: 0 },
        offsetKnown: { type: "boolean" },
      },
      required: [
        "timeSeconds",
        "utcOffsetSeconds",
        "quantumSeconds",
        "offsetKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utcDefined: { type: "boolean" },
        utcLower: { type: "number" },
        utcUpper: { type: "number" },
      },
      required: ["utcDefined", "utcLower", "utcUpper"],
    },
    ports: {
      inputs: [
        {
          id: "timeSeconds",
          label: "Time Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "utcOffsetSeconds",
          label: "Utc Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantumSeconds",
          label: "Quantum Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "utcDefined",
          label: "Utc Defined",
          valueType: { type: "boolean" },
        },
        { id: "utcLower", label: "Utc Lower", valueType: { type: "number" } },
        { id: "utcUpper", label: "Utc Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = acquisitionTimeOffsetPrecisionFlagTool.execute;
export default acquisitionTimeOffsetPrecisionFlagTool;
