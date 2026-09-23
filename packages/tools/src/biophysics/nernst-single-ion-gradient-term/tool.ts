import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outside: number;
  readonly inside: number;
  readonly valence: number;
  readonly gasConstant: number;
  readonly temperatureK: number;
  readonly faraday: number;
};
export type Output = { readonly potentialVolts: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outside: { type: "number", exclusiveMinimum: 0 },
    inside: { type: "number", exclusiveMinimum: 0 },
    valence: { type: "integer" },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    faraday: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "outside",
    "inside",
    "valence",
    "gasConstant",
    "temperatureK",
    "faraday",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { potentialVolts: { type: "number" } },
  required: ["potentialVolts"],
} as const;
/** Ideal single-ion Nernst potential outside/inside in volts with explicit constants; no clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outside, inside, valence, gasConstant, temperatureK, faraday } =
    request;
  const compute = (): Output => {
    H.positive(outside);
    H.positive(inside);
    H.domain(valence !== 0);
    H.positive(gasConstant);
    H.positive(temperatureK);
    H.positive(faraday);
    const relativeDifference = (outside - inside) / inside;
    const logRatio =
      Math.abs(relativeDifference) < 0.5
        ? Math.log1p(relativeDifference)
        : Math.log(outside) - Math.log(inside);
    return {
      potentialVolts:
        (gasConstant * temperatureK * logRatio) / (valence * faraday),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outside: 10,
    inside: 1,
    valence: 1,
    gasConstant: 8,
    temperatureK: 300,
    faraday: 96000,
  },
  output: { potentialVolts: 0.057564627324851146 },
} satisfies ToolExample<Input, Output>;
export const nernstSingleIonGradientTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/nernst-single-ion-gradient-term",
    title: "Nernst Single Ion Gradient Term Tool",
    description:
      "Ideal single-ion Nernst potential outside/inside in volts with explicit constants; no clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outside: { type: "number", exclusiveMinimum: 0 },
        inside: { type: "number", exclusiveMinimum: 0 },
        valence: { type: "integer" },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
        temperatureK: { type: "number", exclusiveMinimum: 0 },
        faraday: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "outside",
        "inside",
        "valence",
        "gasConstant",
        "temperatureK",
        "faraday",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { potentialVolts: { type: "number" } },
      required: ["potentialVolts"],
    },
    ports: {
      inputs: [
        {
          id: "outside",
          label: "Outside",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inside",
          label: "Inside",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "valence",
          label: "Valence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureK",
          label: "Temperature K",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
        {
          id: "faraday",
          label: "Faraday",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "potentialVolts",
          label: "Potential Volts",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nernstSingleIonGradientTermTool.execute;
export default nernstSingleIonGradientTermTool;
