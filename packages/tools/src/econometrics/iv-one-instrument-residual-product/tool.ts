import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrument: number;
  readonly residual: number;
  readonly sampleWeight: number;
};
export type Output = { readonly moment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrument: { type: "number" },
    residual: { type: "number" },
    sampleWeight: { type: "number", minimum: 0 },
  },
  required: ["instrument", "residual", "sampleWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { moment: { type: "number" } },
  required: ["moment"],
} as const;
/** Calculate iv one instrument residual product from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrument, residual, sampleWeight } = request;
  const compute = (): Output => {
    H.domain(sampleWeight >= 0);
    return { moment: sampleWeight * instrument * residual };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { instrument: 2, residual: 3, sampleWeight: 0.5 },
  output: { moment: 3 },
} satisfies ToolExample<Input, Output>;
export const ivOneInstrumentResidualProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/iv-one-instrument-residual-product",
    title: "Iv One Instrument Residual Product Tool",
    description:
      "Calculate iv one instrument residual product from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrument: { type: "number" },
        residual: { type: "number" },
        sampleWeight: { type: "number", minimum: 0 },
      },
      required: ["instrument", "residual", "sampleWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { moment: { type: "number" } },
      required: ["moment"],
    },
    ports: {
      inputs: [
        {
          id: "instrument",
          label: "Instrument",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residual",
          label: "Residual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleWeight",
          label: "Sample Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "moment", label: "Moment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ivOneInstrumentResidualProductTool.execute;
export default ivOneInstrumentResidualProductTool;
