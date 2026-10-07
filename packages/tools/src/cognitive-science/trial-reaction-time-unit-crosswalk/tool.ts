import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reactionTime: number;
  readonly inputIsMilliseconds: boolean;
};
export type Output = {
  readonly seconds: number;
  readonly milliseconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactionTime: { type: "number", minimum: 0 },
    inputIsMilliseconds: { type: "boolean" },
  },
  required: ["reactionTime", "inputIsMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { seconds: { type: "number" }, milliseconds: { type: "number" } },
  required: ["seconds", "milliseconds"],
} as const;
/** Convert an explicitly recorded nonnegative reaction time between seconds and milliseconds without excluding trials. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reactionTime, inputIsMilliseconds } = request;
  const compute = (): Output => {
    H.domain(reactionTime >= 0, "reactionTime");
    return {
      seconds: inputIsMilliseconds ? reactionTime / 1000 : reactionTime,
      milliseconds: inputIsMilliseconds ? reactionTime : reactionTime * 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reactionTime: 450, inputIsMilliseconds: true },
  output: { seconds: 0.45, milliseconds: 450 },
} satisfies ToolExample<Input, Output>;
export const trialReactionTimeUnitCrosswalkTool = H.defineSchemaCalculation<
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
    id: "cognitive-science/trial-reaction-time-unit-crosswalk",
    title: "Trial Reaction Time Unit Crosswalk",
    description:
      "Convert an explicitly recorded nonnegative reaction time between seconds and milliseconds without excluding trials.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reactionTime: { type: "number", minimum: 0 },
        inputIsMilliseconds: { type: "boolean" },
      },
      required: ["reactionTime", "inputIsMilliseconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seconds: { type: "number" },
        milliseconds: { type: "number" },
      },
      required: ["seconds", "milliseconds"],
    },
    ports: {
      inputs: [
        {
          id: "reactionTime",
          label: "Reaction Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputIsMilliseconds",
          label: "Input Is Milliseconds",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "seconds", label: "Seconds", valueType: { type: "number" } },
        {
          id: "milliseconds",
          label: "Milliseconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialReactionTimeUnitCrosswalkTool.execute;
export default trialReactionTimeUnitCrosswalkTool;
