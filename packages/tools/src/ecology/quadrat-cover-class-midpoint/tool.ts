import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly classLowerPercent: number;
  readonly classUpperPercent: number;
};
export type Output = {
  readonly midpointPercent: number;
  readonly intervalWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classLowerPercent: { type: "number", minimum: 0 },
    classUpperPercent: { type: "number", maximum: 100 },
  },
  required: ["classLowerPercent", "classUpperPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midpointPercent: { type: "number" },
    intervalWidth: { type: "number" },
  },
  required: ["midpointPercent", "intervalWidth"],
} as const;
/** Return the midpoint of caller-supplied cover-class bounds without looking up or selecting a cover classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { classLowerPercent, classUpperPercent } = request;
  const compute = (): Output => {
    H.domain(
      classLowerPercent >= 0 &&
        classUpperPercent <= 100 &&
        classUpperPercent >= classLowerPercent,
      "classLowerPercent",
    );
    return {
      midpointPercent: classLowerPercent / 2 + classUpperPercent / 2,
      intervalWidth: classUpperPercent - classLowerPercent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { classLowerPercent: 25, classUpperPercent: 50 },
  output: { midpointPercent: 37.5, intervalWidth: 25 },
} satisfies ToolExample<Input, Output>;
export const quadratCoverClassMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/quadrat-cover-class-midpoint",
    title: "Quadrat Cover Class Midpoint",
    description:
      "Return the midpoint of caller-supplied cover-class bounds without looking up or selecting a cover classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classLowerPercent: { type: "number", minimum: 0 },
        classUpperPercent: { type: "number", maximum: 100 },
      },
      required: ["classLowerPercent", "classUpperPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpointPercent: { type: "number" },
        intervalWidth: { type: "number" },
      },
      required: ["midpointPercent", "intervalWidth"],
    },
    ports: {
      inputs: [
        {
          id: "classLowerPercent",
          label: "Class Lower Percent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "classUpperPercent",
          label: "Class Upper Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "midpointPercent",
          label: "Midpoint Percent",
          valueType: { type: "number" },
        },
        {
          id: "intervalWidth",
          label: "Interval Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quadratCoverClassMidpointTool.execute;
export default quadratCoverClassMidpointTool;
