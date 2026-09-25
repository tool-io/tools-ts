import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly length: number;
  readonly integratedConductivity: number;
  readonly wires: number;
};
export type Output = {
  readonly oneWireHeat: number;
  readonly totalHeat: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    integratedConductivity: { type: "number", minimum: 0 },
    wires: { type: "integer", minimum: 0 },
  },
  required: ["area", "length", "integratedConductivity", "wires"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneWireHeat: { type: "number" },
    totalHeat: { type: "number" },
  },
  required: ["oneWireHeat", "totalHeat"],
} as const;
/** Use the supplied temperature-integrated conductivity integral k(T)dT, not a constant-k approximation across the cryogenic range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, length, integratedConductivity, wires } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && integratedConductivity >= 0);
    H.positive(length);
    H.integer(wires, 0);
    const oneWireHeat = (area * integratedConductivity) / length;
    return { oneWireHeat, totalHeat: wires * oneWireHeat };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 0.000001,
    length: 0.5,
    integratedConductivity: 1000,
    wires: 10,
  },
  output: { oneWireHeat: 0.002, totalHeat: 0.02 },
} satisfies ToolExample<Input, Output>;
export const cryogenicWireConductionOneSegmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cryogenic-wire-conduction-one-segment",
    title: "Cryogenic Wire Conduction One Segment Tool",
    description:
      "Use the supplied temperature-integrated conductivity integral k(T)dT, not a constant-k approximation across the cryogenic range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        integratedConductivity: { type: "number", minimum: 0 },
        wires: { type: "integer", minimum: 0 },
      },
      required: ["area", "length", "integratedConductivity", "wires"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneWireHeat: { type: "number" },
        totalHeat: { type: "number" },
      },
      required: ["oneWireHeat", "totalHeat"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "integratedConductivity",
          label: "Integrated Conductivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wires",
          label: "Wires",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oneWireHeat",
          label: "One Wire Heat",
          valueType: { type: "number" },
        },
        { id: "totalHeat", label: "Total Heat", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cryogenicWireConductionOneSegmentTool.execute;
export default cryogenicWireConductionOneSegmentTool;
