import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shotDuration: number;
  readonly sequenceDuration: number;
  readonly excludedDuration: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly proportion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shotDuration: { type: "number", minimum: 0 },
    sequenceDuration: { type: "number", exclusiveMinimum: 0 },
    excludedDuration: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: [
    "shotDuration",
    "sequenceDuration",
    "excludedDuration",
    "excludeMarked",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    proportion: { type: "number" },
  },
  required: ["denominator", "proportion"],
} as const;
/** Calculate shot duration proportion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shotDuration, sequenceDuration, excludedDuration, excludeMarked } =
    request;
  const compute = (): Output => {
    H.positive(sequenceDuration);
    H.domain(
      shotDuration >= 0 &&
        excludedDuration >= 0 &&
        excludedDuration < sequenceDuration &&
        shotDuration <= sequenceDuration - excludedDuration,
    );
    return {
      denominator: sequenceDuration - (excludeMarked ? excludedDuration : 0),
      proportion:
        shotDuration /
        (sequenceDuration - (excludeMarked ? excludedDuration : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shotDuration: 10,
    sequenceDuration: 100,
    excludedDuration: 20,
    excludeMarked: true,
  },
  output: { denominator: 80, proportion: 0.125 },
} satisfies ToolExample<Input, Output>;
export const shotDurationProportionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/shot-duration-proportion",
    title: "Shot Duration Proportion Tool",
    description:
      "Calculate shot duration proportion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shotDuration: { type: "number", minimum: 0 },
        sequenceDuration: { type: "number", exclusiveMinimum: 0 },
        excludedDuration: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: [
        "shotDuration",
        "sequenceDuration",
        "excludedDuration",
        "excludeMarked",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        proportion: { type: "number" },
      },
      required: ["denominator", "proportion"],
    },
    ports: {
      inputs: [
        {
          id: "shotDuration",
          label: "Shot Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sequenceDuration",
          label: "Sequence Duration",
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
          id: "excludeMarked",
          label: "Exclude Marked",
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
          id: "proportion",
          label: "Proportion",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shotDurationProportionTool.execute;
export default shotDurationProportionTool;
