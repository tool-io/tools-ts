import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly twoWayStartSeconds: number;
  readonly twoWayEndSeconds: number;
  readonly soundSpeed: number;
};
export type Output = {
  readonly nearRange: number;
  readonly farRange: number;
  readonly thickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    twoWayStartSeconds: { type: "number", minimum: 0 },
    twoWayEndSeconds: { type: "number" },
    soundSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["twoWayStartSeconds", "twoWayEndSeconds", "soundSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearRange: { type: "number" },
    farRange: { type: "number" },
    thickness: { type: "number" },
  },
  required: ["nearRange", "farRange", "thickness"],
} as const;
/** Calculate acoustic fish survey range bin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { twoWayStartSeconds, twoWayEndSeconds, soundSpeed } = request;
  const compute = (): Output => {
    H.domain(twoWayStartSeconds >= 0 && twoWayEndSeconds >= twoWayStartSeconds);
    H.positive(soundSpeed);
    return {
      nearRange: (twoWayStartSeconds * soundSpeed) / 2,
      farRange: (twoWayEndSeconds * soundSpeed) / 2,
      thickness: ((twoWayEndSeconds - twoWayStartSeconds) * soundSpeed) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { twoWayStartSeconds: 0.01, twoWayEndSeconds: 0.02, soundSpeed: 1500 },
  output: { nearRange: 7.5, farRange: 15, thickness: 7.5 },
} satisfies ToolExample<Input, Output>;
export const acousticFishSurveyRangeBinTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/acoustic-fish-survey-range-bin",
    title: "Acoustic Fish Survey Range Bin Tool",
    description:
      "Calculate acoustic fish survey range bin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        twoWayStartSeconds: { type: "number", minimum: 0 },
        twoWayEndSeconds: { type: "number" },
        soundSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["twoWayStartSeconds", "twoWayEndSeconds", "soundSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearRange: { type: "number" },
        farRange: { type: "number" },
        thickness: { type: "number" },
      },
      required: ["nearRange", "farRange", "thickness"],
    },
    ports: {
      inputs: [
        {
          id: "twoWayStartSeconds",
          label: "Two Way Start Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "twoWayEndSeconds",
          label: "Two Way End Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "soundSpeed",
          label: "Sound Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "nearRange", label: "Near Range", valueType: { type: "number" } },
        { id: "farRange", label: "Far Range", valueType: { type: "number" } },
        { id: "thickness", label: "Thickness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = acousticFishSurveyRangeBinTool.execute;
export default acousticFishSurveyRangeBinTool;
