import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stackVolumeFlow: number;
  readonly analyteMassPerVolume: number;
};
export type Output = { readonly analyteMassFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stackVolumeFlow: { type: "number", minimum: 0 },
    analyteMassPerVolume: { type: "number", minimum: 0 },
  },
  required: ["stackVolumeFlow", "analyteMassPerVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { analyteMassFlow: { type: "number" } },
  required: ["analyteMassFlow"],
} as const;
/** Multiply supplied stack volume flow by concentration on the same reference temperature, pressure and moisture basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stackVolumeFlow, analyteMassPerVolume } = request;
  const compute = (): Output => {
    H.domain(stackVolumeFlow >= 0, "stackVolumeFlow");
    H.domain(analyteMassPerVolume >= 0, "analyteMassPerVolume");
    return { analyteMassFlow: stackVolumeFlow * analyteMassPerVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stackVolumeFlow: 20, analyteMassPerVolume: 0.5 },
  output: { analyteMassFlow: 10 },
} satisfies ToolExample<Input, Output>;
export const emissionStackFlowConcentrationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/emission-stack-flow-concentration-term",
    title: "Emission Stack Flow Concentration Term",
    description:
      "Multiply supplied stack volume flow by concentration on the same reference temperature, pressure and moisture basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stackVolumeFlow: { type: "number", minimum: 0 },
        analyteMassPerVolume: { type: "number", minimum: 0 },
      },
      required: ["stackVolumeFlow", "analyteMassPerVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { analyteMassFlow: { type: "number" } },
      required: ["analyteMassFlow"],
    },
    ports: {
      inputs: [
        {
          id: "stackVolumeFlow",
          label: "Stack Volume Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analyteMassPerVolume",
          label: "Analyte Mass Per Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "analyteMassFlow",
          label: "Analyte Mass Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emissionStackFlowConcentrationTermTool.execute;
export default emissionStackFlowConcentrationTermTool;
