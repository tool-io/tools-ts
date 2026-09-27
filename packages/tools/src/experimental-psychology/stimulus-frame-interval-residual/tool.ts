import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFrame: number;
  readonly lastFrame: number;
  readonly refreshHertz: number;
  readonly suppliedTargetSeconds: number;
};
export type Output = {
  readonly intervalSeconds: number;
  readonly residualSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFrame: { type: "integer" },
    lastFrame: { type: "integer" },
    refreshHertz: { type: "number", exclusiveMinimum: 0 },
    suppliedTargetSeconds: { type: "number" },
  },
  required: [
    "firstFrame",
    "lastFrame",
    "refreshHertz",
    "suppliedTargetSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalSeconds: { type: "number" },
    residualSeconds: { type: "number" },
  },
  required: ["intervalSeconds", "residualSeconds"],
} as const;
/** Compare a supplied frame-to-frame interval against a target without rounding or generating frame schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFrame, lastFrame, refreshHertz, suppliedTargetSeconds } =
    request;
  const compute = (): Output => {
    H.positive(refreshHertz);
    H.domain(lastFrame >= firstFrame);
    return {
      intervalSeconds: (lastFrame - firstFrame) / refreshHertz,
      residualSeconds:
        (lastFrame - firstFrame) / refreshHertz - suppliedTargetSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstFrame: 10,
    lastFrame: 40,
    refreshHertz: 60,
    suppliedTargetSeconds: 0.4,
  },
  output: { intervalSeconds: 0.5, residualSeconds: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const stimulusFrameIntervalResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/stimulus-frame-interval-residual",
    title: "Stimulus Frame Interval Residual Tool",
    description:
      "Compare a supplied frame-to-frame interval against a target without rounding or generating frame schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFrame: { type: "integer" },
        lastFrame: { type: "integer" },
        refreshHertz: { type: "number", exclusiveMinimum: 0 },
        suppliedTargetSeconds: { type: "number" },
      },
      required: [
        "firstFrame",
        "lastFrame",
        "refreshHertz",
        "suppliedTargetSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalSeconds: { type: "number" },
        residualSeconds: { type: "number" },
      },
      required: ["intervalSeconds", "residualSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstFrame",
          label: "First Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastFrame",
          label: "Last Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "refreshHertz",
          label: "Refresh Hertz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTargetSeconds",
          label: "Supplied Target Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intervalSeconds",
          label: "Interval Seconds",
          valueType: { type: "number" },
        },
        {
          id: "residualSeconds",
          label: "Residual Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stimulusFrameIntervalResidualTool.execute;
export default stimulusFrameIntervalResidualTool;
