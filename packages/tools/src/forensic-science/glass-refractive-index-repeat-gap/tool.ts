import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIndex: number;
  readonly secondIndex: number;
  readonly temperatureDifference: number;
  readonly temperatureCoefficient: number;
};
export type Output = {
  readonly rawDifference: number;
  readonly temperatureAdjustedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "number", exclusiveMinimum: 0 },
    secondIndex: { type: "number", exclusiveMinimum: 0 },
    temperatureDifference: { type: "number" },
    temperatureCoefficient: { type: "number" },
  },
  required: [
    "firstIndex",
    "secondIndex",
    "temperatureDifference",
    "temperatureCoefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawDifference: { type: "number" },
    temperatureAdjustedDifference: { type: "number" },
  },
  required: ["rawDifference", "temperatureAdjustedDifference"],
} as const;
/** Two refractive-index observations with an explicit linear temperature correction, not a common-source conclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstIndex,
    secondIndex,
    temperatureDifference,
    temperatureCoefficient,
  } = request;
  const compute = (): Output => {
    H.positive(firstIndex);
    H.positive(secondIndex);
    return {
      rawDifference: secondIndex - firstIndex,
      temperatureAdjustedDifference:
        secondIndex -
        firstIndex -
        temperatureCoefficient * temperatureDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstIndex: 1.51,
    secondIndex: 1.52,
    temperatureDifference: 2,
    temperatureCoefficient: 0.001,
  },
  output: {
    rawDifference: 0.010000000000000009,
    temperatureAdjustedDifference: 0.008000000000000009,
  },
} satisfies ToolExample<Input, Output>;
export const glassRefractiveIndexRepeatGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/glass-refractive-index-repeat-gap",
    title: "Glass Refractive Index Repeat Gap Tool",
    description:
      "Two refractive-index observations with an explicit linear temperature correction, not a common-source conclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "number", exclusiveMinimum: 0 },
        secondIndex: { type: "number", exclusiveMinimum: 0 },
        temperatureDifference: { type: "number" },
        temperatureCoefficient: { type: "number" },
      },
      required: [
        "firstIndex",
        "secondIndex",
        "temperatureDifference",
        "temperatureCoefficient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawDifference: { type: "number" },
        temperatureAdjustedDifference: { type: "number" },
      },
      required: ["rawDifference", "temperatureAdjustedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondIndex",
          label: "Second Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureDifference",
          label: "Temperature Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureCoefficient",
          label: "Temperature Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawDifference",
          label: "Raw Difference",
          valueType: { type: "number" },
        },
        {
          id: "temperatureAdjustedDifference",
          label: "Temperature Adjusted Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = glassRefractiveIndexRepeatGapTool.execute;
export default glassRefractiveIndexRepeatGapTool;
