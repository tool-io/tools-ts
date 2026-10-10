import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longitudinalRise: number;
  readonly longitudinalRun: number;
  readonly crossRise: number;
  readonly crossRun: number;
};
export type Output = {
  readonly longitudinalGrade: number;
  readonly crossGrade: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitudinalRise: { type: "number" },
    longitudinalRun: { type: "number", exclusiveMinimum: 0 },
    crossRise: { type: "number" },
    crossRun: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["longitudinalRise", "longitudinalRun", "crossRise", "crossRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitudinalGrade: { type: "number" },
    crossGrade: { type: "number" },
  },
  required: ["longitudinalGrade", "crossGrade"],
} as const;
/** Calculate explicit signed longitudinal and cross grades from separate rise-run pairs without evaluating accessibility or drainage standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longitudinalRise, longitudinalRun, crossRise, crossRun } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(longitudinalRun) && longitudinalRun > 0,
      "longitudinalRun",
    ),
      longitudinalRun);
    (H.domain(Number.isFinite(crossRun) && crossRun > 0, "crossRun"), crossRun);
    return {
      longitudinalGrade: longitudinalRise / longitudinalRun,
      crossGrade: crossRise / crossRun,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    longitudinalRise: 0.5,
    longitudinalRun: 10,
    crossRise: 0.04,
    crossRun: 2,
  },
  output: { longitudinalGrade: 0.05, crossGrade: 0.02 },
} satisfies ToolExample<Input, Output>;
export const pathLongitudinalCrossGradePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/path-longitudinal-cross-grade-pair",
    title: "Path Longitudinal Cross Grade Pair",
    description:
      "Calculate explicit signed longitudinal and cross grades from separate rise-run pairs without evaluating accessibility or drainage standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longitudinalRise: { type: "number" },
        longitudinalRun: { type: "number", exclusiveMinimum: 0 },
        crossRise: { type: "number" },
        crossRun: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "longitudinalRise",
        "longitudinalRun",
        "crossRise",
        "crossRun",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longitudinalGrade: { type: "number" },
        crossGrade: { type: "number" },
      },
      required: ["longitudinalGrade", "crossGrade"],
    },
    ports: {
      inputs: [
        {
          id: "longitudinalRise",
          label: "Longitudinal Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "longitudinalRun",
          label: "Longitudinal Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crossRise",
          label: "Cross Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crossRun",
          label: "Cross Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "longitudinalGrade",
          label: "Longitudinal Grade",
          valueType: { type: "number" },
        },
        {
          id: "crossGrade",
          label: "Cross Grade",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pathLongitudinalCrossGradePairTool.execute;
export default pathLongitudinalCrossGradePairTool;
