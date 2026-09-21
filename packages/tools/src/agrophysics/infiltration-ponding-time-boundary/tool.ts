import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly pondingTime: number;
  readonly equalityIsPostPonding: boolean;
};
export type Output = {
  readonly postPonding: boolean;
  readonly signedElapsed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    pondingTime: { type: "number" },
    equalityIsPostPonding: { type: "boolean" },
  },
  required: ["time", "pondingTime", "equalityIsPostPonding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postPonding: { type: "boolean" },
    signedElapsed: { type: "number" },
  },
  required: ["postPonding", "signedElapsed"],
} as const;
/** Apply an explicit supplied event-boundary rule without estimating infiltration parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, pondingTime, equalityIsPostPonding } = request;
  const compute = (): Output => {
    return {
      postPonding: equalityIsPostPonding
        ? time >= pondingTime
        : time > pondingTime,
      signedElapsed: time - pondingTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { time: 10, pondingTime: 10, equalityIsPostPonding: true },
  output: { postPonding: true, signedElapsed: 0 },
} satisfies ToolExample<Input, Output>;
export const infiltrationPondingTimeBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/infiltration-ponding-time-boundary",
    title: "Infiltration Ponding Time Boundary Tool",
    description:
      "Apply an explicit supplied event-boundary rule without estimating infiltration parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        pondingTime: { type: "number" },
        equalityIsPostPonding: { type: "boolean" },
      },
      required: ["time", "pondingTime", "equalityIsPostPonding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postPonding: { type: "boolean" },
        signedElapsed: { type: "number" },
      },
      required: ["postPonding", "signedElapsed"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pondingTime",
          label: "Ponding Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityIsPostPonding",
          label: "Equality Is Post Ponding",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "postPonding",
          label: "Post Ponding",
          valueType: { type: "boolean" },
        },
        {
          id: "signedElapsed",
          label: "Signed Elapsed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = infiltrationPondingTimeBoundaryTool.execute;
export default infiltrationPondingTimeBoundaryTool;
