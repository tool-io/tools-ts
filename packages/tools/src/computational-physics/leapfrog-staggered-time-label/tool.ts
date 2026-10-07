import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stepId: string;
  readonly positionTimeText: string;
  readonly velocityTimeText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepId: { type: "string", maxLength: 8192, minLength: 1 },
    positionTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    velocityTimeText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["stepId", "positionTimeText", "velocityTimeText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit position and velocity staggered-time labels without advancing a leapfrog integrator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stepId, positionTimeText, velocityTimeText } = request;
  const compute = (): Output => {
    H.domain(stepId.length > 0, "stepId");
    H.domain(positionTimeText.length > 0, "positionTimeText");
    H.domain(velocityTimeText.length > 0, "velocityTimeText");
    return {
      token: JSON.stringify([stepId, positionTimeText, velocityTimeText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stepId: "S17",
    positionTimeText: "n dt",
    velocityTimeText: "(n+1/2) dt",
  },
  output: { token: '["S17","n dt","(n+1/2) dt"]' },
} satisfies ToolExample<Input, Output>;
export const leapfrogStaggeredTimeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/leapfrog-staggered-time-label",
    title: "Leapfrog Staggered Time Label",
    description:
      "Preserve explicit position and velocity staggered-time labels without advancing a leapfrog integrator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepId: { type: "string", maxLength: 8192, minLength: 1 },
        positionTimeText: { type: "string", maxLength: 8192, minLength: 1 },
        velocityTimeText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["stepId", "positionTimeText", "velocityTimeText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "stepId",
          label: "Step Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "positionTimeText",
          label: "Position Time Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "velocityTimeText",
          label: "Velocity Time Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = leapfrogStaggeredTimeLabelTool.execute;
export default leapfrogStaggeredTimeLabelTool;
