import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedStart: number;
  readonly observedEnd: number;
  readonly allowedStart: number;
  readonly allowedEnd: number;
};
export type Output = {
  readonly coveredDuration: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedStart: { type: "number" },
    observedEnd: { type: "number" },
    allowedStart: { type: "number" },
    allowedEnd: { type: "number" },
  },
  required: ["observedStart", "observedEnd", "allowedStart", "allowedEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredDuration: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["coveredDuration", "fraction"],
} as const;
/** Audit supplied research visit-window observation coverage without clinical scheduling guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedStart, observedEnd, allowedStart, allowedEnd } = request;
  const compute = (): Output => {
    H.domain(observedStart <= observedEnd && allowedStart < allowedEnd);
    return {
      coveredDuration: Math.max(
        0,
        Math.min(observedEnd, allowedEnd) -
          Math.max(observedStart, allowedStart),
      ),
      fraction:
        Math.max(
          0,
          Math.min(observedEnd, allowedEnd) -
            Math.max(observedStart, allowedStart),
        ) /
        (allowedEnd - allowedStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedStart: 0,
    observedEnd: 20,
    allowedStart: 10,
    allowedEnd: 30,
  },
  output: { coveredDuration: 10, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const visitWindowCoverageFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/visit-window-coverage-fraction",
    title: "Visit Window Coverage Fraction Tool",
    description:
      "Audit supplied research visit-window observation coverage without clinical scheduling guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedStart: { type: "number" },
        observedEnd: { type: "number" },
        allowedStart: { type: "number" },
        allowedEnd: { type: "number" },
      },
      required: ["observedStart", "observedEnd", "allowedStart", "allowedEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredDuration: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["coveredDuration", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "observedStart",
          label: "Observed Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedEnd",
          label: "Observed End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedStart",
          label: "Allowed Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedEnd",
          label: "Allowed End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredDuration",
          label: "Covered Duration",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = visitWindowCoverageFractionTool.execute;
export default visitWindowCoverageFractionTool;
