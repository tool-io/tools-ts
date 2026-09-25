import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly delaySeconds: number;
};
export type Output = { readonly phaseRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", minimum: 0 },
    delaySeconds: { type: "number", minimum: 0 },
  },
  required: ["frequencyHz", "delaySeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseRadians: { type: "number" } },
  required: ["phaseRadians"],
} as const;
/** Calculate loop delay phase contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, delaySeconds } = request;
  const compute = (): Output => {
    H.domain(frequencyHz >= 0 && delaySeconds >= 0);
    return { phaseRadians: -2 * Math.PI * frequencyHz * delaySeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyHz: 2, delaySeconds: 0.25 },
  output: { phaseRadians: -3.141592653589793 },
} satisfies ToolExample<Input, Output>;
export const loopDelayPhaseContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/loop-delay-phase-contribution",
    title: "Loop Delay Phase Contribution Tool",
    description:
      "Calculate loop delay phase contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", minimum: 0 },
        delaySeconds: { type: "number", minimum: 0 },
      },
      required: ["frequencyHz", "delaySeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseRadians: { type: "number" } },
      required: ["phaseRadians"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delaySeconds",
          label: "Delay Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = loopDelayPhaseContributionTool.execute;
export default loopDelayPhaseContributionTool;
