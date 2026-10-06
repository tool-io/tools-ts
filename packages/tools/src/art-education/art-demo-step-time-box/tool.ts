import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedMinutes: number;
  readonly elapsedMinutes: number;
};
export type Output = {
  readonly remainingMinutes: number;
  readonly overrunMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedMinutes: { type: "number", minimum: 0 },
    elapsedMinutes: { type: "number", minimum: 0 },
  },
  required: ["allocatedMinutes", "elapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMinutes: { type: "number" },
    overrunMinutes: { type: "number" },
  },
  required: ["remainingMinutes", "overrunMinutes"],
} as const;
/** Balance a recorded art-demonstration step against an explicitly allocated time box. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedMinutes, elapsedMinutes } = request;
  const compute = (): Output => {
    H.domain(allocatedMinutes >= 0 && elapsedMinutes >= 0, "allocatedMinutes");
    return {
      remainingMinutes: Math.max(0, allocatedMinutes - elapsedMinutes),
      overrunMinutes: Math.max(0, elapsedMinutes - allocatedMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedMinutes: 15, elapsedMinutes: 12 },
  output: { remainingMinutes: 3, overrunMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const artDemoStepTimeBoxTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/art-demo-step-time-box",
    title: "Art Demo Step Time Box",
    description:
      "Balance a recorded art-demonstration step against an explicitly allocated time box.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedMinutes: { type: "number", minimum: 0 },
        elapsedMinutes: { type: "number", minimum: 0 },
      },
      required: ["allocatedMinutes", "elapsedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingMinutes: { type: "number" },
        overrunMinutes: { type: "number" },
      },
      required: ["remainingMinutes", "overrunMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "allocatedMinutes",
          label: "Allocated Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number" },
        },
        {
          id: "overrunMinutes",
          label: "Overrun Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artDemoStepTimeBoxTool.execute;
export default artDemoStepTimeBoxTool;
