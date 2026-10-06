import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly turnStartSeconds: number;
  readonly turnEndSeconds: number;
  readonly speakingAllowanceSeconds: number;
};
export type Output = {
  readonly durationSeconds: number;
  readonly allowanceMarginSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnStartSeconds: { type: "number" },
    turnEndSeconds: { type: "number" },
    speakingAllowanceSeconds: { type: "number", minimum: 0 },
  },
  required: ["turnStartSeconds", "turnEndSeconds", "speakingAllowanceSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationSeconds: { type: "number" },
    allowanceMarginSeconds: { type: "number" },
  },
  required: ["durationSeconds", "allowanceMarginSeconds"],
} as const;
/** Compare a recorded critique-response turn with an explicit speaking allowance on a shared timestamp scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { turnStartSeconds, turnEndSeconds, speakingAllowanceSeconds } =
    request;
  const compute = (): Output => {
    H.domain(
      turnEndSeconds >= turnStartSeconds && speakingAllowanceSeconds >= 0,
      "turnEndSeconds",
    );
    return {
      durationSeconds: turnEndSeconds - turnStartSeconds,
      allowanceMarginSeconds:
        speakingAllowanceSeconds - turnEndSeconds + turnStartSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    turnStartSeconds: 100,
    turnEndSeconds: 145,
    speakingAllowanceSeconds: 60,
  },
  output: { durationSeconds: 45, allowanceMarginSeconds: 15 },
} satisfies ToolExample<Input, Output>;
export const critiqueResponseTurnTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/critique-response-turn-time",
    title: "Critique Response Turn Time",
    description:
      "Compare a recorded critique-response turn with an explicit speaking allowance on a shared timestamp scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turnStartSeconds: { type: "number" },
        turnEndSeconds: { type: "number" },
        speakingAllowanceSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "turnStartSeconds",
        "turnEndSeconds",
        "speakingAllowanceSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationSeconds: { type: "number" },
        allowanceMarginSeconds: { type: "number" },
      },
      required: ["durationSeconds", "allowanceMarginSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "turnStartSeconds",
          label: "Turn Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "turnEndSeconds",
          label: "Turn End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speakingAllowanceSeconds",
          label: "Speaking Allowance Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
        {
          id: "allowanceMarginSeconds",
          label: "Allowance Margin Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = critiqueResponseTurnTimeTool.execute;
export default critiqueResponseTurnTimeTool;
