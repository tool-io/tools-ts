import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusAt: number;
  readonly responseAt: number;
  readonly instrumentDelay: number;
};
export type Output = { readonly correctedDelay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusAt: { type: "number" },
    responseAt: { type: "number" },
    instrumentDelay: { type: "number", minimum: 0 },
  },
  required: ["stimulusAt", "responseAt", "instrumentDelay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedDelay: { type: "number" } },
  required: ["correctedDelay"],
} as const;
/** Calculate stimulus response delay offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusAt, responseAt, instrumentDelay } = request;
  const compute = (): Output => {
    H.domain(instrumentDelay >= 0);
    return { correctedDelay: responseAt - stimulusAt - instrumentDelay };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimulusAt: 10, responseAt: 30, instrumentDelay: 5 },
  output: { correctedDelay: 15 },
} satisfies ToolExample<Input, Output>;
export const stimulusResponseDelayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/stimulus-response-delay-offset",
    title: "Stimulus Response Delay Offset Tool",
    description:
      "Calculate stimulus response delay offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusAt: { type: "number" },
        responseAt: { type: "number" },
        instrumentDelay: { type: "number", minimum: 0 },
      },
      required: ["stimulusAt", "responseAt", "instrumentDelay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedDelay: { type: "number" } },
      required: ["correctedDelay"],
    },
    ports: {
      inputs: [
        {
          id: "stimulusAt",
          label: "Stimulus At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "instrumentDelay",
          label: "Instrument Delay",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedDelay",
          label: "Corrected Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stimulusResponseDelayOffsetTool.execute;
export default stimulusResponseDelayOffsetTool;
