import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacitancePerArea: number;
  readonly area: number;
  readonly potentialChange: number;
};
export type Output = { readonly capacitance: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitancePerArea: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
    potentialChange: { type: "number" },
  },
  required: ["capacitancePerArea", "area", "potentialChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capacitance: { type: "number" }, charge: { type: "number" } },
  required: ["capacitance", "charge"],
} as const;
/** Constant differential double-layer capacitance approximation over the supplied potential change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitancePerArea, area, potentialChange } = request;
  const compute = (): Output => {
    H.domain(capacitancePerArea >= 0);
    H.positive(area);
    return {
      capacitance: capacitancePerArea * area,
      charge: capacitancePerArea * area * potentialChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacitancePerArea: 0.02, area: 5, potentialChange: 0.2 },
  output: { capacitance: 0.1, charge: 0.020000000000000004 },
} satisfies ToolExample<Input, Output>;
export const electrodeDoubleLayerChargeAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrode-double-layer-charge-area-term",
    title: "Electrode Double Layer Charge Area Term Tool",
    description:
      "Constant differential double-layer capacitance approximation over the supplied potential change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitancePerArea: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
        potentialChange: { type: "number" },
      },
      required: ["capacitancePerArea", "area", "potentialChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitance: { type: "number" },
        charge: { type: "number" },
      },
      required: ["capacitance", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "capacitancePerArea",
          label: "Capacitance Per Area",
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
          id: "potentialChange",
          label: "Potential Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "capacitance",
          label: "Capacitance",
          valueType: { type: "number" },
        },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = electrodeDoubleLayerChargeAreaTermTool.execute;
export default electrodeDoubleLayerChargeAreaTermTool;
