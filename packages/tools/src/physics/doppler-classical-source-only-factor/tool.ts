import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waveSpeed: number;
  readonly sourceTowardObserver: number;
};
export type Output = { readonly frequencyFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waveSpeed: { type: "number", exclusiveMinimum: 0 },
    sourceTowardObserver: { type: "number" },
  },
  required: ["waveSpeed", "sourceTowardObserver"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frequencyFactor: { type: "number" } },
  required: ["frequencyFactor"],
} as const;
/** Calculate doppler classical source only factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waveSpeed, sourceTowardObserver } = request;
  const compute = (): Output => {
    H.positive(waveSpeed);
    H.domain(sourceTowardObserver < waveSpeed);
    return { frequencyFactor: waveSpeed / (waveSpeed - sourceTowardObserver) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waveSpeed: 340, sourceTowardObserver: 34 },
  output: { frequencyFactor: 1.1111111111111112 },
} satisfies ToolExample<Input, Output>;
export const dopplerClassicalSourceOnlyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/doppler-classical-source-only-factor",
    title: "Doppler Classical Source Only Factor Tool",
    description:
      "Calculate doppler classical source only factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waveSpeed: { type: "number", exclusiveMinimum: 0 },
        sourceTowardObserver: { type: "number" },
      },
      required: ["waveSpeed", "sourceTowardObserver"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { frequencyFactor: { type: "number" } },
      required: ["frequencyFactor"],
    },
    ports: {
      inputs: [
        {
          id: "waveSpeed",
          label: "Wave Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceTowardObserver",
          label: "Source Toward Observer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "frequencyFactor",
          label: "Frequency Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dopplerClassicalSourceOnlyFactorTool.execute;
export default dopplerClassicalSourceOnlyFactorTool;
