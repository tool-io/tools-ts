import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousLevel: number;
  readonly nextLevel: number;
};
export type Output = {
  readonly signedStep: number;
  readonly direction: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousLevel: { type: "number" },
    nextLevel: { type: "number" },
  },
  required: ["previousLevel", "nextLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedStep: { type: "number" },
    direction: { type: "string", maxLength: 8192 },
  },
  required: ["signedStep", "direction"],
} as const;
/** Report the signed change and direction between two supplied hearing-test stimulus levels in the same unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousLevel, nextLevel } = request;
  const compute = (): Output => {
    return {
      signedStep: nextLevel - previousLevel,
      direction:
        nextLevel > previousLevel
          ? "up"
          : nextLevel < previousLevel
            ? "down"
            : "unchanged",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousLevel: 20, nextLevel: 25 },
  output: { signedStep: 5, direction: "up" },
} satisfies ToolExample<Input, Output>;
export const hearingThresholdStepDirectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/hearing-threshold-step-direction",
    title: "Hearing Threshold Step Direction",
    description:
      "Report the signed change and direction between two supplied hearing-test stimulus levels in the same unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousLevel: { type: "number" },
        nextLevel: { type: "number" },
      },
      required: ["previousLevel", "nextLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedStep: { type: "number" },
        direction: { type: "string", maxLength: 8192 },
      },
      required: ["signedStep", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "previousLevel",
          label: "Previous Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextLevel",
          label: "Next Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedStep",
          label: "Signed Step",
          valueType: { type: "number" },
        },
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = hearingThresholdStepDirectionTool.execute;
export default hearingThresholdStepDirectionTool;
