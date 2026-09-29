import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDepth: number;
  readonly correctionFactor: number;
  readonly wettingLoss: number;
  readonly evaporationLoss: number;
};
export type Output = {
  readonly correctedDepth: number;
  readonly addedDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDepth: { type: "number", minimum: 0 },
    correctionFactor: { type: "number", exclusiveMinimum: 0 },
    wettingLoss: { type: "number", minimum: 0 },
    evaporationLoss: { type: "number", minimum: 0 },
  },
  required: [
    "observedDepth",
    "correctionFactor",
    "wettingLoss",
    "evaporationLoss",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedDepth: { type: "number" },
    addedDepth: { type: "number" },
  },
  required: ["correctedDepth", "addedDepth"],
} as const;
/** Caller-supplied multiplicative aerodynamic correction followed by additive wetting and evaporation losses; no instrument-specific wind model is fitted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDepth, correctionFactor, wettingLoss, evaporationLoss } =
    request;
  const compute = (): Output => {
    H.domain(observedDepth >= 0 && wettingLoss >= 0 && evaporationLoss >= 0);
    H.positive(correctionFactor);
    return {
      correctedDepth:
        observedDepth * correctionFactor + wettingLoss + evaporationLoss,
      addedDepth:
        observedDepth * (correctionFactor - 1) + wettingLoss + evaporationLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedDepth: 8,
    correctionFactor: 1.2,
    wettingLoss: 0.2,
    evaporationLoss: 0.1,
  },
  output: { correctedDepth: 9.899999999999999, addedDepth: 1.8999999999999997 },
} satisfies ToolExample<Input, Output>;
export const gaugeUndercatchSuppliedWindFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/gauge-undercatch-supplied-wind-factor",
    title: "Gauge Undercatch Supplied Wind Factor Tool",
    description:
      "Caller-supplied multiplicative aerodynamic correction followed by additive wetting and evaporation losses; no instrument-specific wind model is fitted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDepth: { type: "number", minimum: 0 },
        correctionFactor: { type: "number", exclusiveMinimum: 0 },
        wettingLoss: { type: "number", minimum: 0 },
        evaporationLoss: { type: "number", minimum: 0 },
      },
      required: [
        "observedDepth",
        "correctionFactor",
        "wettingLoss",
        "evaporationLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedDepth: { type: "number" },
        addedDepth: { type: "number" },
      },
      required: ["correctedDepth", "addedDepth"],
    },
    ports: {
      inputs: [
        {
          id: "observedDepth",
          label: "Observed Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correctionFactor",
          label: "Correction Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wettingLoss",
          label: "Wetting Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporationLoss",
          label: "Evaporation Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedDepth",
          label: "Corrected Depth",
          valueType: { type: "number" },
        },
        {
          id: "addedDepth",
          label: "Added Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugeUndercatchSuppliedWindFactorTool.execute;
export default gaugeUndercatchSuppliedWindFactorTool;
