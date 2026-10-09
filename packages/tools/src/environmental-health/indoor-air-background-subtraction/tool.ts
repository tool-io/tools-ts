import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indoorConcentration: number;
  readonly backgroundConcentration: number;
};
export type Output = { readonly backgroundRelativeConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indoorConcentration: { type: "number" },
    backgroundConcentration: { type: "number" },
  },
  required: ["indoorConcentration", "backgroundConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { backgroundRelativeConcentration: { type: "number" } },
  required: ["backgroundRelativeConcentration"],
} as const;
/** Subtract an explicit compatible air background concentration while preserving negative corrected results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indoorConcentration, backgroundConcentration } = request;
  const compute = (): Output => {
    return {
      backgroundRelativeConcentration:
        indoorConcentration - backgroundConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indoorConcentration: 25, backgroundConcentration: 10 },
  output: { backgroundRelativeConcentration: 15 },
} satisfies ToolExample<Input, Output>;
export const indoorAirBackgroundSubtractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/indoor-air-background-subtraction",
    title: "Indoor Air Background Subtraction",
    description:
      "Subtract an explicit compatible air background concentration while preserving negative corrected results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indoorConcentration: { type: "number" },
        backgroundConcentration: { type: "number" },
      },
      required: ["indoorConcentration", "backgroundConcentration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { backgroundRelativeConcentration: { type: "number" } },
      required: ["backgroundRelativeConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "indoorConcentration",
          label: "Indoor Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundConcentration",
          label: "Background Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "backgroundRelativeConcentration",
          label: "Background Relative Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = indoorAirBackgroundSubtractionTool.execute;
export default indoorAirBackgroundSubtractionTool;
