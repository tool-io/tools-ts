import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly desiredOutput: number;
  readonly plantGain: number;
  readonly disturbance: number;
  readonly disturbanceGain: number;
};
export type Output = { readonly feedforwardInput: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    desiredOutput: { type: "number" },
    plantGain: { type: "number" },
    disturbance: { type: "number" },
    disturbanceGain: { type: "number" },
  },
  required: ["desiredOutput", "plantGain", "disturbance", "disturbanceGain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { feedforwardInput: { type: "number" } },
  required: ["feedforwardInput"],
} as const;
/** Calculate feedforward gain static inverse factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { desiredOutput, plantGain, disturbance, disturbanceGain } = request;
  const compute = (): Output => {
    H.domain(plantGain !== 0);
    return {
      feedforwardInput:
        (desiredOutput - disturbanceGain * disturbance) / plantGain,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    desiredOutput: 10,
    plantGain: 2,
    disturbance: 3,
    disturbanceGain: 2,
  },
  output: { feedforwardInput: 2 },
} satisfies ToolExample<Input, Output>;
export const feedforwardGainStaticInverseFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/feedforward-gain-static-inverse-factor",
    title: "Feedforward Gain Static Inverse Factor Tool",
    description:
      "Calculate feedforward gain static inverse factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        desiredOutput: { type: "number" },
        plantGain: { type: "number" },
        disturbance: { type: "number" },
        disturbanceGain: { type: "number" },
      },
      required: [
        "desiredOutput",
        "plantGain",
        "disturbance",
        "disturbanceGain",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { feedforwardInput: { type: "number" } },
      required: ["feedforwardInput"],
    },
    ports: {
      inputs: [
        {
          id: "desiredOutput",
          label: "Desired Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantGain",
          label: "Plant Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "disturbance",
          label: "Disturbance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "disturbanceGain",
          label: "Disturbance Gain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "feedforwardInput",
          label: "Feedforward Input",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedforwardGainStaticInverseFactorTool.execute;
export default feedforwardGainStaticInverseFactorTool;
