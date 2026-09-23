import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly insideCation: number;
  readonly insideAnion: number;
  readonly outsideCation: number;
  readonly outsideAnion: number;
};
export type Output = {
  readonly insideProduct: number;
  readonly outsideProduct: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideCation: { type: "number", minimum: 0 },
    insideAnion: { type: "number", minimum: 0 },
    outsideCation: { type: "number", minimum: 0 },
    outsideAnion: { type: "number", minimum: 0 },
  },
  required: ["insideCation", "insideAnion", "outsideCation", "outsideAnion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideProduct: { type: "number" },
    outsideProduct: { type: "number" },
    residual: { type: "number" },
  },
  required: ["insideProduct", "outsideProduct", "residual"],
} as const;
/** One ideal monovalent Donnan product-balance residual; it does not solve electroneutrality or membrane potential. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { insideCation, insideAnion, outsideCation, outsideAnion } = request;
  const compute = (): Output => {
    H.domain(
      insideCation >= 0 &&
        insideAnion >= 0 &&
        outsideCation >= 0 &&
        outsideAnion >= 0,
    );
    return {
      insideProduct: insideCation * insideAnion,
      outsideProduct: outsideCation * outsideAnion,
      residual: insideCation * insideAnion - outsideCation * outsideAnion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { insideCation: 2, insideAnion: 8, outsideCation: 4, outsideAnion: 4 },
  output: { insideProduct: 16, outsideProduct: 16, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const membraneDonnanProductResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/membrane-donnan-product-residual",
    title: "Membrane Donnan Product Residual Tool",
    description:
      "One ideal monovalent Donnan product-balance residual; it does not solve electroneutrality or membrane potential.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insideCation: { type: "number", minimum: 0 },
        insideAnion: { type: "number", minimum: 0 },
        outsideCation: { type: "number", minimum: 0 },
        outsideAnion: { type: "number", minimum: 0 },
      },
      required: [
        "insideCation",
        "insideAnion",
        "outsideCation",
        "outsideAnion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insideProduct: { type: "number" },
        outsideProduct: { type: "number" },
        residual: { type: "number" },
      },
      required: ["insideProduct", "outsideProduct", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "insideCation",
          label: "Inside Cation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insideAnion",
          label: "Inside Anion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outsideCation",
          label: "Outside Cation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outsideAnion",
          label: "Outside Anion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "insideProduct",
          label: "Inside Product",
          valueType: { type: "number" },
        },
        {
          id: "outsideProduct",
          label: "Outside Product",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = membraneDonnanProductResidualTool.execute;
export default membraneDonnanProductResidualTool;
