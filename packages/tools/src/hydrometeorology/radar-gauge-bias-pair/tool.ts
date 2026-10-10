import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radarDepth: number;
  readonly gaugeDepth: number;
};
export type Output = {
  readonly additiveBias: number;
  readonly multiplicativeBias: number;
  readonly ratioDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radarDepth: { type: "number", minimum: 0 },
    gaugeDepth: { type: "number", minimum: 0 },
  },
  required: ["radarDepth", "gaugeDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    additiveBias: { type: "number" },
    multiplicativeBias: { type: "number" },
    ratioDefined: { type: "boolean" },
  },
  required: ["additiveBias", "multiplicativeBias", "ratioDefined"],
} as const;
/** Compare explicit matched radar and gauge precipitation depths, reporting an undefined gauge-ratio denominator separately. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radarDepth, gaugeDepth } = request;
  const compute = (): Output => {
    H.domain(radarDepth >= 0 && gaugeDepth >= 0, "radarDepth");
    return {
      additiveBias: radarDepth - gaugeDepth,
      multiplicativeBias: gaugeDepth > 0 ? radarDepth / gaugeDepth : 0,
      ratioDefined: gaugeDepth > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radarDepth: 12, gaugeDepth: 10 },
  output: { additiveBias: 2, multiplicativeBias: 1.2, ratioDefined: true },
} satisfies ToolExample<Input, Output>;
export const radarGaugeBiasPairTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/radar-gauge-bias-pair",
    title: "Radar Gauge Bias Pair",
    description:
      "Compare explicit matched radar and gauge precipitation depths, reporting an undefined gauge-ratio denominator separately.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radarDepth: { type: "number", minimum: 0 },
        gaugeDepth: { type: "number", minimum: 0 },
      },
      required: ["radarDepth", "gaugeDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        additiveBias: { type: "number" },
        multiplicativeBias: { type: "number" },
        ratioDefined: { type: "boolean" },
      },
      required: ["additiveBias", "multiplicativeBias", "ratioDefined"],
    },
    ports: {
      inputs: [
        {
          id: "radarDepth",
          label: "Radar Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gaugeDepth",
          label: "Gauge Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "additiveBias",
          label: "Additive Bias",
          valueType: { type: "number" },
        },
        {
          id: "multiplicativeBias",
          label: "Multiplicative Bias",
          valueType: { type: "number" },
        },
        {
          id: "ratioDefined",
          label: "Ratio Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = radarGaugeBiasPairTool.execute;
export default radarGaugeBiasPairTool;
