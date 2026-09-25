import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coarseDiameterMm: number;
  readonly fineDiameterMm: number;
  readonly count: number;
  readonly total: number;
};
export type Output = {
  readonly lowerPhi: number;
  readonly upperPhi: number;
  readonly phiWidth: number;
  readonly densityPerPhi: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coarseDiameterMm: { type: "number" },
    fineDiameterMm: { type: "number", exclusiveMinimum: 0 },
    count: { type: "integer", minimum: 0 },
    total: { type: "integer", minimum: 1 },
  },
  required: ["coarseDiameterMm", "fineDiameterMm", "count", "total"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerPhi: { type: "number" },
    upperPhi: { type: "number" },
    phiWidth: { type: "number" },
    densityPerPhi: { type: "number" },
  },
  required: ["lowerPhi", "upperPhi", "phiWidth", "densityPerPhi"],
} as const;
/** Calculate sediment grain phi bin width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coarseDiameterMm, fineDiameterMm, count, total } = request;
  const compute = (): Output => {
    H.positive(fineDiameterMm);
    H.domain(coarseDiameterMm > fineDiameterMm);
    H.integer(total, 1);
    H.integer(count, 0, total);
    return {
      lowerPhi: -Math.log2(coarseDiameterMm),
      upperPhi: -Math.log2(fineDiameterMm),
      phiWidth: Math.log2(coarseDiameterMm / fineDiameterMm),
      densityPerPhi:
        count / (total * Math.log2(coarseDiameterMm / fineDiameterMm)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coarseDiameterMm: 2, fineDiameterMm: 1, count: 20, total: 100 },
  output: { lowerPhi: -1, upperPhi: 0, phiWidth: 1, densityPerPhi: 0.2 },
} satisfies ToolExample<Input, Output>;
export const sedimentGrainPhiBinWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/sediment-grain-phi-bin-width",
    title: "Sediment Grain Phi Bin Width Tool",
    description:
      "Calculate sediment grain phi bin width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coarseDiameterMm: { type: "number" },
        fineDiameterMm: { type: "number", exclusiveMinimum: 0 },
        count: { type: "integer", minimum: 0 },
        total: { type: "integer", minimum: 1 },
      },
      required: ["coarseDiameterMm", "fineDiameterMm", "count", "total"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerPhi: { type: "number" },
        upperPhi: { type: "number" },
        phiWidth: { type: "number" },
        densityPerPhi: { type: "number" },
      },
      required: ["lowerPhi", "upperPhi", "phiWidth", "densityPerPhi"],
    },
    ports: {
      inputs: [
        {
          id: "coarseDiameterMm",
          label: "Coarse Diameter Mm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fineDiameterMm",
          label: "Fine Diameter Mm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lowerPhi", label: "Lower Phi", valueType: { type: "number" } },
        { id: "upperPhi", label: "Upper Phi", valueType: { type: "number" } },
        { id: "phiWidth", label: "Phi Width", valueType: { type: "number" } },
        {
          id: "densityPerPhi",
          label: "Density Per Phi",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sedimentGrainPhiBinWidthTool.execute;
export default sedimentGrainPhiBinWidthTool;
