import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly firstCoefficient: number;
  readonly secondCoefficient: number;
  readonly temperatureChange: number;
  readonly initialClearance: number;
};
export type Output = {
  readonly differentialExpansion: number;
  readonly remainingClearance: number;
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    firstCoefficient: { type: "number" },
    secondCoefficient: { type: "number" },
    temperatureChange: { type: "number" },
    initialClearance: { type: "number" },
  },
  required: [
    "length",
    "firstCoefficient",
    "secondCoefficient",
    "temperatureChange",
    "initialClearance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differentialExpansion: { type: "number" },
    remainingClearance: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["differentialExpansion", "remainingClearance", "derivative"],
} as const;
/** Linear differential thermal expansion using supplied coefficients, without a conservation treatment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    length,
    firstCoefficient,
    secondCoefficient,
    temperatureChange,
    initialClearance,
  } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    return {
      differentialExpansion:
        length * (firstCoefficient - secondCoefficient) * temperatureChange,
      remainingClearance:
        initialClearance -
        length * (firstCoefficient - secondCoefficient) * temperatureChange,
      derivative: -length * (firstCoefficient - secondCoefficient),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    length: 100,
    firstCoefficient: 0.00002,
    secondCoefficient: 0.00001,
    temperatureChange: 10,
    initialClearance: 0.1,
  },
  output: {
    differentialExpansion: 0.01,
    remainingClearance: 0.09000000000000001,
    derivative: -0.001,
  },
} satisfies ToolExample<Input, Output>;
export const mountExpansionClearanceDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/mount-expansion-clearance-derivative",
    title: "Mount Expansion Clearance Derivative Tool",
    description:
      "Linear differential thermal expansion using supplied coefficients, without a conservation treatment recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        firstCoefficient: { type: "number" },
        secondCoefficient: { type: "number" },
        temperatureChange: { type: "number" },
        initialClearance: { type: "number" },
      },
      required: [
        "length",
        "firstCoefficient",
        "secondCoefficient",
        "temperatureChange",
        "initialClearance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        differentialExpansion: { type: "number" },
        remainingClearance: { type: "number" },
        derivative: { type: "number" },
      },
      required: ["differentialExpansion", "remainingClearance", "derivative"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstCoefficient",
          label: "First Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCoefficient",
          label: "Second Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureChange",
          label: "Temperature Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialClearance",
          label: "Initial Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "differentialExpansion",
          label: "Differential Expansion",
          valueType: { type: "number" },
        },
        {
          id: "remainingClearance",
          label: "Remaining Clearance",
          valueType: { type: "number" },
        },
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mountExpansionClearanceDerivativeTool.execute;
export default mountExpansionClearanceDerivativeTool;
