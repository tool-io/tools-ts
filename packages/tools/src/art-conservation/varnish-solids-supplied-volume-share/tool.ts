import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockVolume: number;
  readonly stockSolidsFraction: number;
  readonly addedSolventVolume: number;
};
export type Output = {
  readonly solidsVolume: number;
  readonly finalVolume: number;
  readonly finalSolidsFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockVolume: { type: "number", minimum: 0 },
    stockSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
    addedSolventVolume: { type: "number", minimum: 0 },
  },
  required: ["stockVolume", "stockSolidsFraction", "addedSolventVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidsVolume: { type: "number" },
    finalVolume: { type: "number" },
    finalSolidsFraction: { type: "number" },
  },
  required: ["solidsVolume", "finalVolume", "finalSolidsFraction"],
} as const;
/** Additive-volume solids fraction only; no solvent compatibility or conservation treatment is recommended. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockVolume, stockSolidsFraction, addedSolventVolume } = request;
  const compute = (): Output => {
    H.domain(
      stockVolume >= 0 &&
        addedSolventVolume >= 0 &&
        stockVolume + addedSolventVolume > 0,
    );
    H.probability(stockSolidsFraction);
    return {
      solidsVolume: stockVolume * stockSolidsFraction,
      finalVolume: stockVolume + addedSolventVolume,
      finalSolidsFraction:
        (stockVolume * stockSolidsFraction) /
        (stockVolume + addedSolventVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stockVolume: 100,
    stockSolidsFraction: 0.4,
    addedSolventVolume: 100,
  },
  output: { solidsVolume: 40, finalVolume: 200, finalSolidsFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const varnishSolidsSuppliedVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/varnish-solids-supplied-volume-share",
    title: "Varnish Solids Supplied Volume Share Tool",
    description:
      "Additive-volume solids fraction only; no solvent compatibility or conservation treatment is recommended.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockVolume: { type: "number", minimum: 0 },
        stockSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
        addedSolventVolume: { type: "number", minimum: 0 },
      },
      required: ["stockVolume", "stockSolidsFraction", "addedSolventVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidsVolume: { type: "number" },
        finalVolume: { type: "number" },
        finalSolidsFraction: { type: "number" },
      },
      required: ["solidsVolume", "finalVolume", "finalSolidsFraction"],
    },
    ports: {
      inputs: [
        {
          id: "stockVolume",
          label: "Stock Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stockSolidsFraction",
          label: "Stock Solids Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedSolventVolume",
          label: "Added Solvent Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidsVolume",
          label: "Solids Volume",
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          valueType: { type: "number" },
        },
        {
          id: "finalSolidsFraction",
          label: "Final Solids Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = varnishSolidsSuppliedVolumeShareTool.execute;
export default varnishSolidsSuppliedVolumeShareTool;
