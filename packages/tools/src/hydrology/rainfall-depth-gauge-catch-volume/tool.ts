import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depthMm: number;
  readonly orificeDiameterMm: number;
  readonly catchEfficiency: number;
};
export type Output = {
  readonly orificeAreaMm2: number;
  readonly idealCatchMl: number;
  readonly expectedCatchMl: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthMm: { type: "number", minimum: 0 },
    orificeDiameterMm: { type: "number", exclusiveMinimum: 0 },
    catchEfficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["depthMm", "orificeDiameterMm", "catchEfficiency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orificeAreaMm2: { type: "number" },
    idealCatchMl: { type: "number" },
    expectedCatchMl: { type: "number" },
  },
  required: ["orificeAreaMm2", "idealCatchMl", "expectedCatchMl"],
} as const;
/** Circular gauge orifice geometry with 1000 mm3 per mL; efficiency reduces expected collected volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depthMm, orificeDiameterMm, catchEfficiency } = request;
  const compute = (): Output => {
    H.domain(depthMm >= 0 && catchEfficiency > 0 && catchEfficiency <= 1);
    H.positive(orificeDiameterMm);
    const orificeAreaMm2 = (Math.PI * orificeDiameterMm ** 2) / 4,
      idealCatchMl = (depthMm * orificeAreaMm2) / 1000;
    return {
      orificeAreaMm2,
      idealCatchMl,
      expectedCatchMl: idealCatchMl * catchEfficiency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depthMm: 10, orificeDiameterMm: 100, catchEfficiency: 0.8 },
  output: {
    orificeAreaMm2: 7853.981633974483,
    idealCatchMl: 78.53981633974483,
    expectedCatchMl: 62.83185307179587,
  },
} satisfies ToolExample<Input, Output>;
export const rainfallDepthGaugeCatchVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rainfall-depth-gauge-catch-volume",
    title: "Rainfall Depth Gauge Catch Volume Tool",
    description:
      "Circular gauge orifice geometry with 1000 mm3 per mL; efficiency reduces expected collected volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depthMm: { type: "number", minimum: 0 },
        orificeDiameterMm: { type: "number", exclusiveMinimum: 0 },
        catchEfficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["depthMm", "orificeDiameterMm", "catchEfficiency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orificeAreaMm2: { type: "number" },
        idealCatchMl: { type: "number" },
        expectedCatchMl: { type: "number" },
      },
      required: ["orificeAreaMm2", "idealCatchMl", "expectedCatchMl"],
    },
    ports: {
      inputs: [
        {
          id: "depthMm",
          label: "Depth Mm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "orificeDiameterMm",
          label: "Orifice Diameter Mm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "catchEfficiency",
          label: "Catch Efficiency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "orificeAreaMm2",
          label: "Orifice Area Mm2",
          valueType: { type: "number" },
        },
        {
          id: "idealCatchMl",
          label: "Ideal Catch Ml",
          valueType: { type: "number" },
        },
        {
          id: "expectedCatchMl",
          label: "Expected Catch Ml",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainfallDepthGaugeCatchVolumeTool.execute;
export default rainfallDepthGaugeCatchVolumeTool;
