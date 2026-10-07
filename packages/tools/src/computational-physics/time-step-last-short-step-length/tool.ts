import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentTime: number;
  readonly endTime: number;
  readonly nominalTimeStep: number;
};
export type Output = {
  readonly stepLength: number;
  readonly reachesEnd: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentTime: { type: "number" },
    endTime: { type: "number" },
    nominalTimeStep: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["currentTime", "endTime", "nominalTimeStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepLength: { type: "number" },
    reachesEnd: { type: "boolean" },
  },
  required: ["stepLength", "reachesEnd"],
} as const;
/** Shorten an explicitly supplied nominal time step to end exactly at a specified integration boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentTime, endTime, nominalTimeStep } = request;
  const compute = (): Output => {
    H.domain(endTime >= currentTime, "endTime");
    (H.domain(nominalTimeStep > 0, "nominalTimeStep"), nominalTimeStep);
    return {
      stepLength: Math.min(nominalTimeStep, endTime - currentTime),
      reachesEnd: nominalTimeStep >= endTime - currentTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentTime: 0.9, endTime: 1, nominalTimeStep: 0.2 },
  output: { stepLength: 0.09999999999999998, reachesEnd: true },
} satisfies ToolExample<Input, Output>;
export const timeStepLastShortStepLengthTool = H.defineSchemaCalculation<
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
    id: "computational-physics/time-step-last-short-step-length",
    title: "Time Step Last Short Step Length",
    description:
      "Shorten an explicitly supplied nominal time step to end exactly at a specified integration boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentTime: { type: "number" },
        endTime: { type: "number" },
        nominalTimeStep: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["currentTime", "endTime", "nominalTimeStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepLength: { type: "number" },
        reachesEnd: { type: "boolean" },
      },
      required: ["stepLength", "reachesEnd"],
    },
    ports: {
      inputs: [
        {
          id: "currentTime",
          label: "Current Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endTime",
          label: "End Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nominalTimeStep",
          label: "Nominal Time Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stepLength",
          label: "Step Length",
          valueType: { type: "number" },
        },
        {
          id: "reachesEnd",
          label: "Reaches End",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = timeStepLastShortStepLengthTool.execute;
export default timeStepLastShortStepLengthTool;
