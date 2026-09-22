import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTemperature: number;
  readonly secondTemperature: number;
  readonly firstMolarMass: number;
  readonly secondMolarMass: number;
  readonly firstGravity: number;
  readonly secondGravity: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTemperature: { type: "number", exclusiveMinimum: 0 },
    secondTemperature: { type: "number", exclusiveMinimum: 0 },
    firstMolarMass: { type: "number", exclusiveMinimum: 0 },
    secondMolarMass: { type: "number", exclusiveMinimum: 0 },
    firstGravity: { type: "number", exclusiveMinimum: 0 },
    secondGravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstTemperature",
    "secondTemperature",
    "firstMolarMass",
    "secondMolarMass",
    "firstGravity",
    "secondGravity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare ideal isothermal scale heights R*T/(M*g) using compatible supplied units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstTemperature,
    secondTemperature,
    firstMolarMass,
    secondMolarMass,
    firstGravity,
    secondGravity,
  } = request;
  const compute = (): Output => {
    H.positive(firstTemperature);
    H.positive(secondTemperature);
    H.positive(firstMolarMass);
    H.positive(secondMolarMass);
    H.positive(firstGravity);
    H.positive(secondGravity);
    return {
      ratio:
        ((((firstTemperature / secondTemperature) * secondMolarMass) /
          firstMolarMass) *
          secondGravity) /
        firstGravity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTemperature: 300,
    secondTemperature: 250,
    firstMolarMass: 29,
    secondMolarMass: 29,
    firstGravity: 10,
    secondGravity: 10,
  },
  output: { ratio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const atmosphericScaleHeightRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/atmospheric-scale-height-ratio",
    title: "Atmospheric Scale Height Ratio Tool",
    description:
      "Compare ideal isothermal scale heights R*T/(M*g) using compatible supplied units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTemperature: { type: "number", exclusiveMinimum: 0 },
        secondTemperature: { type: "number", exclusiveMinimum: 0 },
        firstMolarMass: { type: "number", exclusiveMinimum: 0 },
        secondMolarMass: { type: "number", exclusiveMinimum: 0 },
        firstGravity: { type: "number", exclusiveMinimum: 0 },
        secondGravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstTemperature",
        "secondTemperature",
        "firstMolarMass",
        "secondMolarMass",
        "firstGravity",
        "secondGravity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstTemperature",
          label: "First Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTemperature",
          label: "Second Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstMolarMass",
          label: "First Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMolarMass",
          label: "Second Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstGravity",
          label: "First Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondGravity",
          label: "Second Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = atmosphericScaleHeightRatioTool.execute;
export default atmosphericScaleHeightRatioTool;
