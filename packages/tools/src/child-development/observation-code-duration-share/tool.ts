import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetDuration: number;
  readonly otherDuration: number;
  readonly excludedDuration: number;
  readonly includeExcluded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly targetShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetDuration: { type: "number", minimum: 0 },
    otherDuration: { type: "number", minimum: 0 },
    excludedDuration: { type: "number", minimum: 0 },
    includeExcluded: { type: "boolean" },
  },
  required: [
    "targetDuration",
    "otherDuration",
    "excludedDuration",
    "includeExcluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    targetShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "targetShare", "defined"],
} as const;
/** Summarize already coded research observation durations without inferring behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetDuration, otherDuration, excludedDuration, includeExcluded } =
    request;
  const compute = (): Output => {
    H.domain(
      targetDuration >= 0 && otherDuration >= 0 && excludedDuration >= 0,
    );
    return {
      denominator:
        targetDuration +
        otherDuration +
        (includeExcluded ? excludedDuration : 0),
      targetShare:
        targetDuration +
          otherDuration +
          (includeExcluded ? excludedDuration : 0) >
        0
          ? targetDuration /
            (targetDuration +
              otherDuration +
              (includeExcluded ? excludedDuration : 0))
          : 0,
      defined:
        targetDuration +
          otherDuration +
          (includeExcluded ? excludedDuration : 0) >
        0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetDuration: 30,
    otherDuration: 60,
    excludedDuration: 10,
    includeExcluded: true,
  },
  output: { denominator: 100, targetShare: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const observationCodeDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/observation-code-duration-share",
    title: "Observation Code Duration Share Tool",
    description:
      "Summarize already coded research observation durations without inferring behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetDuration: { type: "number", minimum: 0 },
        otherDuration: { type: "number", minimum: 0 },
        excludedDuration: { type: "number", minimum: 0 },
        includeExcluded: { type: "boolean" },
      },
      required: [
        "targetDuration",
        "otherDuration",
        "excludedDuration",
        "includeExcluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        targetShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "targetShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "targetDuration",
          label: "Target Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherDuration",
          label: "Other Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeExcluded",
          label: "Include Excluded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "targetShare",
          label: "Target Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = observationCodeDurationShareTool.execute;
export default observationCodeDurationShareTool;
