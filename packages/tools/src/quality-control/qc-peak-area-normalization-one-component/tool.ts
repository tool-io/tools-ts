import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly responseFactors: readonly number[];
  readonly index: number;
};
export type Output = {
  readonly correctedAreas: readonly number[];
  readonly correctedTotal: number;
  readonly componentFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    responseFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    index: { type: "integer", minimum: 0 },
  },
  required: ["areas", "responseFactors", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    correctedTotal: { type: "number" },
    componentFraction: { type: "number" },
  },
  required: ["correctedAreas", "correctedTotal", "componentFraction"],
} as const;
/** Calculate qc peak area normalization one component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, responseFactors, index } = request;
  const compute = (): Output => {
    H.sameLength(areas, responseFactors);
    H.domain(
      areas.length > 0 &&
        areas.every((x) => x >= 0) &&
        responseFactors.every((x) => x > 0) &&
        areas.some((x) => x > 0),
    );
    H.integer(index, 0, areas.length - 1);
    return {
      correctedAreas: areas.map((x, i) => x / responseFactors[i]),
      correctedTotal: areas.reduce((a, x, i) => a + x / responseFactors[i], 0),
      componentFraction:
        areas[index] /
        responseFactors[index] /
        areas.reduce((a, x, i) => a + x / responseFactors[i], 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areas: [20, 40], responseFactors: [1, 2], index: 1 },
  output: {
    correctedAreas: [20, 20],
    correctedTotal: 40,
    componentFraction: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const qcPeakAreaNormalizationOneComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-control/qc-peak-area-normalization-one-component",
      title: "QC Peak Area Normalization One Component Tool",
      description:
        "Calculate qc peak area normalization one component from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areas: { type: "array", maxItems: 256, items: { type: "number" } },
          responseFactors: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          index: { type: "integer", minimum: 0 },
        },
        required: ["areas", "responseFactors", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedAreas: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          correctedTotal: { type: "number" },
          componentFraction: { type: "number" },
        },
        required: ["correctedAreas", "correctedTotal", "componentFraction"],
      },
      ports: {
        inputs: [
          {
            id: "areas",
            label: "Areas",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "responseFactors",
            label: "Response Factors",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "correctedAreas",
            label: "Corrected Areas",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "correctedTotal",
            label: "Corrected Total",
            valueType: { type: "number" },
          },
          {
            id: "componentFraction",
            label: "Component Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = qcPeakAreaNormalizationOneComponentTool.execute;
export default qcPeakAreaNormalizationOneComponentTool;
