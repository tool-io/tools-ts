import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly production: number;
  readonly inflow: number;
  readonly outflow: number;
  readonly degradation: number;
  readonly volume: number;
};
export type Output = {
  readonly amountRate: number;
  readonly concentrationRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    production: { type: "number" },
    inflow: { type: "number" },
    outflow: { type: "number" },
    degradation: { type: "number" },
    volume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["production", "inflow", "outflow", "degradation", "volume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountRate: { type: "number" },
    concentrationRate: { type: "number" },
  },
  required: ["amountRate", "concentrationRate"],
} as const;
/** Calculate morphogen source sink flux balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { production, inflow, outflow, degradation, volume } = request;
  const compute = (): Output => {
    H.domain([production, inflow, outflow, degradation].every((x) => x >= 0));
    H.positive(volume);
    return {
      amountRate: production + inflow - outflow - degradation,
      concentrationRate: (production + inflow - outflow - degradation) / volume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { production: 10, inflow: 2, outflow: 3, degradation: 5, volume: 2 },
  output: { amountRate: 4, concentrationRate: 2 },
} satisfies ToolExample<Input, Output>;
export const morphogenSourceSinkFluxBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/morphogen-source-sink-flux-balance",
    title: "Morphogen Source Sink Flux Balance Tool",
    description:
      "Calculate morphogen source sink flux balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        production: { type: "number" },
        inflow: { type: "number" },
        outflow: { type: "number" },
        degradation: { type: "number" },
        volume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["production", "inflow", "outflow", "degradation", "volume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountRate: { type: "number" },
        concentrationRate: { type: "number" },
      },
      required: ["amountRate", "concentrationRate"],
    },
    ports: {
      inputs: [
        {
          id: "production",
          label: "Production",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflow",
          label: "Inflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outflow",
          label: "Outflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "degradation",
          label: "Degradation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "amountRate",
          label: "Amount Rate",
          valueType: { type: "number" },
        },
        {
          id: "concentrationRate",
          label: "Concentration Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = morphogenSourceSinkFluxBalanceTool.execute;
export default morphogenSourceSinkFluxBalanceTool;
