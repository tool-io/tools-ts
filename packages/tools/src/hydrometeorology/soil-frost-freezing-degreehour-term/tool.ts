import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly freezingReference: number;
  readonly hours: number;
  readonly coefficient: number;
};
export type Output = {
  readonly freezingDegreeHours: number;
  readonly indexedExposure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    freezingReference: { type: "number" },
    hours: { type: "number", minimum: 0 },
    coefficient: { type: "number", minimum: 0 },
  },
  required: ["temperature", "freezingReference", "hours", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freezingDegreeHours: { type: "number" },
    indexedExposure: { type: "number" },
  },
  required: ["freezingDegreeHours", "indexedExposure"],
} as const;
/** Cold degree-hour exposure with an explicit index multiplier, without a frost-depth or latent-heat model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, freezingReference, hours, coefficient } = request;
  const compute = (): Output => {
    H.domain(hours >= 0 && coefficient >= 0);
    return {
      freezingDegreeHours: Math.max(0, freezingReference - temperature) * hours,
      indexedExposure:
        Math.max(0, freezingReference - temperature) * hours * coefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperature: -5, freezingReference: 0, hours: 4, coefficient: 0.5 },
  output: { freezingDegreeHours: 20, indexedExposure: 10 },
} satisfies ToolExample<Input, Output>;
export const soilFrostFreezingDegreehourTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/soil-frost-freezing-degreehour-term",
    title: "Soil Frost Freezing Degreehour Term Tool",
    description:
      "Cold degree-hour exposure with an explicit index multiplier, without a frost-depth or latent-heat model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperature: { type: "number" },
        freezingReference: { type: "number" },
        hours: { type: "number", minimum: 0 },
        coefficient: { type: "number", minimum: 0 },
      },
      required: ["temperature", "freezingReference", "hours", "coefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freezingDegreeHours: { type: "number" },
        indexedExposure: { type: "number" },
      },
      required: ["freezingDegreeHours", "indexedExposure"],
    },
    ports: {
      inputs: [
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freezingReference",
          label: "Freezing Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "freezingDegreeHours",
          label: "Freezing Degree Hours",
          valueType: { type: "number" },
        },
        {
          id: "indexedExposure",
          label: "Indexed Exposure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilFrostFreezingDegreehourTermTool.execute;
export default soilFrostFreezingDegreehourTermTool;
