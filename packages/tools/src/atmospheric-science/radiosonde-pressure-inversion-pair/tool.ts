import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerLevelPressure: number;
  readonly upperLevelPressure: number;
};
export type Output = {
  readonly pressureChange: number;
  readonly inversion: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerLevelPressure: { type: "number", exclusiveMinimum: 0 },
    upperLevelPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lowerLevelPressure", "upperLevelPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureChange: { type: "number" },
    inversion: { type: "boolean" },
  },
  required: ["pressureChange", "inversion"],
} as const;
/** Flag an explicit pressure increase between caller-ordered lower and upper sounding levels without attributing instrument error. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerLevelPressure, upperLevelPressure } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(lowerLevelPressure) && lowerLevelPressure > 0,
      "lowerLevelPressure",
    ),
      lowerLevelPressure);
    (H.domain(
      Number.isFinite(upperLevelPressure) && upperLevelPressure > 0,
      "upperLevelPressure",
    ),
      upperLevelPressure);
    return {
      pressureChange: upperLevelPressure - lowerLevelPressure,
      inversion: upperLevelPressure > lowerLevelPressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerLevelPressure: 900, upperLevelPressure: 920 },
  output: { pressureChange: 20, inversion: true },
} satisfies ToolExample<Input, Output>;
export const radiosondePressureInversionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/radiosonde-pressure-inversion-pair",
    title: "Radiosonde Pressure Inversion Pair",
    description:
      "Flag an explicit pressure increase between caller-ordered lower and upper sounding levels without attributing instrument error.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerLevelPressure: { type: "number", exclusiveMinimum: 0 },
        upperLevelPressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["lowerLevelPressure", "upperLevelPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureChange: { type: "number" },
        inversion: { type: "boolean" },
      },
      required: ["pressureChange", "inversion"],
    },
    ports: {
      inputs: [
        {
          id: "lowerLevelPressure",
          label: "Lower Level Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperLevelPressure",
          label: "Upper Level Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pressureChange",
          label: "Pressure Change",
          valueType: { type: "number" },
        },
        { id: "inversion", label: "Inversion", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = radiosondePressureInversionPairTool.execute;
export default radiosondePressureInversionPairTool;
