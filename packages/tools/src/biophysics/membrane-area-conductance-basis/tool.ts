import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalConductance: number;
  readonly area: number;
  readonly referenceArea: number;
};
export type Output = {
  readonly conductancePerArea: number;
  readonly referenceConductance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalConductance: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalConductance", "area", "referenceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductancePerArea: { type: "number" },
    referenceConductance: { type: "number" },
  },
  required: ["conductancePerArea", "referenceConductance"],
} as const;
/** Calculate membrane area conductance basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalConductance, area, referenceArea } = request;
  const compute = (): Output => {
    H.domain(totalConductance >= 0);
    H.positive(area);
    H.positive(referenceArea);
    return {
      conductancePerArea: totalConductance / area,
      referenceConductance: (totalConductance * referenceArea) / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalConductance: 10, area: 2, referenceArea: 3 },
  output: { conductancePerArea: 5, referenceConductance: 15 },
} satisfies ToolExample<Input, Output>;
export const membraneAreaConductanceBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/membrane-area-conductance-basis",
    title: "Membrane Area Conductance Basis Tool",
    description:
      "Calculate membrane area conductance basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalConductance: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
        referenceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalConductance", "area", "referenceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conductancePerArea: { type: "number" },
        referenceConductance: { type: "number" },
      },
      required: ["conductancePerArea", "referenceConductance"],
    },
    ports: {
      inputs: [
        {
          id: "totalConductance",
          label: "Total Conductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conductancePerArea",
          label: "Conductance Per Area",
          valueType: { type: "number" },
        },
        {
          id: "referenceConductance",
          label: "Reference Conductance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = membraneAreaConductanceBasisTool.execute;
export default membraneAreaConductanceBasisTool;
