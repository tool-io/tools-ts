import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredCurrentAmperes: number;
  readonly selectedRangeAmperes: number;
};
export type Output = {
  readonly overRange: boolean;
  readonly absoluteRangeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredCurrentAmperes: { type: "number" },
    selectedRangeAmperes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredCurrentAmperes", "selectedRangeAmperes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overRange: { type: "boolean" },
    absoluteRangeFraction: { type: "number" },
  },
  required: ["overRange", "absoluteRangeFraction"],
} as const;
/** Compare a signed current reading’s magnitude with an explicit inclusive potentiostat range without selecting an instrument setting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredCurrentAmperes, selectedRangeAmperes } = request;
  const compute = (): Output => {
    (H.domain(selectedRangeAmperes > 0, "selectedRangeAmperes"),
      selectedRangeAmperes);
    return {
      overRange: Math.abs(measuredCurrentAmperes) > selectedRangeAmperes,
      absoluteRangeFraction:
        Math.abs(measuredCurrentAmperes) / selectedRangeAmperes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredCurrentAmperes: 0.012, selectedRangeAmperes: 0.01 },
  output: { overRange: true, absoluteRangeFraction: 1.2 },
} satisfies ToolExample<Input, Output>;
export const potentiostatOverRangeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/potentiostat-over-range-flag",
    title: "Potentiostat Over Range Flag",
    description:
      "Compare a signed current reading’s magnitude with an explicit inclusive potentiostat range without selecting an instrument setting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredCurrentAmperes: { type: "number" },
        selectedRangeAmperes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredCurrentAmperes", "selectedRangeAmperes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overRange: { type: "boolean" },
        absoluteRangeFraction: { type: "number" },
      },
      required: ["overRange", "absoluteRangeFraction"],
    },
    ports: {
      inputs: [
        {
          id: "measuredCurrentAmperes",
          label: "Measured Current Amperes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "selectedRangeAmperes",
          label: "Selected Range Amperes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overRange",
          label: "Over Range",
          valueType: { type: "boolean" },
        },
        {
          id: "absoluteRangeFraction",
          label: "Absolute Range Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = potentiostatOverRangeFlagTool.execute;
export default potentiostatOverRangeFlagTool;
