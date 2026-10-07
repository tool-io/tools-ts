import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDelayMilliseconds: number;
  readonly stepMilliseconds: number;
  readonly inhibitionSuccessful: boolean;
  readonly minimumDelayMilliseconds: number;
  readonly maximumDelayMilliseconds: number;
};
export type Output = {
  readonly nextDelayMilliseconds: number;
  readonly boundaryClipped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDelayMilliseconds: { type: "number" },
    stepMilliseconds: { type: "number", minimum: 0 },
    inhibitionSuccessful: { type: "boolean" },
    minimumDelayMilliseconds: { type: "number", minimum: 0 },
    maximumDelayMilliseconds: { type: "number" },
  },
  required: [
    "currentDelayMilliseconds",
    "stepMilliseconds",
    "inhibitionSuccessful",
    "minimumDelayMilliseconds",
    "maximumDelayMilliseconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextDelayMilliseconds: { type: "number" },
    boundaryClipped: { type: "boolean" },
  },
  required: ["nextDelayMilliseconds", "boundaryClipped"],
} as const;
/** Apply one explicitly specified success-increase/failure-decrease stop-signal delay step with caller-supplied bounds, without estimating inhibition latency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    currentDelayMilliseconds,
    stepMilliseconds,
    inhibitionSuccessful,
    minimumDelayMilliseconds,
    maximumDelayMilliseconds,
  } = request;
  const compute = (): Output => {
    H.domain(
      stepMilliseconds >= 0 &&
        minimumDelayMilliseconds >= 0 &&
        maximumDelayMilliseconds >= minimumDelayMilliseconds &&
        currentDelayMilliseconds >= minimumDelayMilliseconds &&
        currentDelayMilliseconds <= maximumDelayMilliseconds,
      "stepMilliseconds",
    );
    return (() => {
      const proposed =
          currentDelayMilliseconds +
          (inhibitionSuccessful ? stepMilliseconds : -stepMilliseconds),
        nextDelayMilliseconds = Math.max(
          minimumDelayMilliseconds,
          Math.min(maximumDelayMilliseconds, proposed),
        );
      return {
        nextDelayMilliseconds,
        boundaryClipped: nextDelayMilliseconds !== proposed,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentDelayMilliseconds: 250,
    stepMilliseconds: 50,
    inhibitionSuccessful: true,
    minimumDelayMilliseconds: 0,
    maximumDelayMilliseconds: 500,
  },
  output: { nextDelayMilliseconds: 300, boundaryClipped: false },
} satisfies ToolExample<Input, Output>;
export const stopSignalSingleDelayStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/stop-signal-single-delay-step",
    title: "Stop Signal Single Delay Step",
    description:
      "Apply one explicitly specified success-increase/failure-decrease stop-signal delay step with caller-supplied bounds, without estimating inhibition latency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDelayMilliseconds: { type: "number" },
        stepMilliseconds: { type: "number", minimum: 0 },
        inhibitionSuccessful: { type: "boolean" },
        minimumDelayMilliseconds: { type: "number", minimum: 0 },
        maximumDelayMilliseconds: { type: "number" },
      },
      required: [
        "currentDelayMilliseconds",
        "stepMilliseconds",
        "inhibitionSuccessful",
        "minimumDelayMilliseconds",
        "maximumDelayMilliseconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextDelayMilliseconds: { type: "number" },
        boundaryClipped: { type: "boolean" },
      },
      required: ["nextDelayMilliseconds", "boundaryClipped"],
    },
    ports: {
      inputs: [
        {
          id: "currentDelayMilliseconds",
          label: "Current Delay Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepMilliseconds",
          label: "Step Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inhibitionSuccessful",
          label: "Inhibition Successful",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "minimumDelayMilliseconds",
          label: "Minimum Delay Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumDelayMilliseconds",
          label: "Maximum Delay Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nextDelayMilliseconds",
          label: "Next Delay Milliseconds",
          valueType: { type: "number" },
        },
        {
          id: "boundaryClipped",
          label: "Boundary Clipped",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stopSignalSingleDelayStepTool.execute;
export default stopSignalSingleDelayStepTool;
