import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly qt: number;
  readonly rr: number;
  readonly qtSecondsPerUnit: number;
  readonly rrSecondsPerUnit: number;
};
export type Output = {
  readonly qtSeconds: number;
  readonly rrSeconds: number;
  readonly qtRrRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    qt: { type: "number", minimum: 0 },
    rr: { type: "number", exclusiveMinimum: 0 },
    qtSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
    rrSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["qt", "rr", "qtSecondsPerUnit", "rrSecondsPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    qtSeconds: { type: "number" },
    rrSeconds: { type: "number" },
    qtRrRatio: { type: "number" },
  },
  required: ["qtSeconds", "rrSeconds", "qtRrRatio"],
} as const;
/** Unit-normalized supplied QT/RR intervals only; no QT correction formula or risk interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { qt, rr, qtSecondsPerUnit, rrSecondsPerUnit } = request;
  const compute = (): Output => {
    H.domain(qt >= 0);
    H.positive(rr);
    H.positive(qtSecondsPerUnit);
    H.positive(rrSecondsPerUnit);
    return {
      qtSeconds: qt * qtSecondsPerUnit,
      rrSeconds: rr * rrSecondsPerUnit,
      qtRrRatio: (qt * qtSecondsPerUnit) / (rr * rrSecondsPerUnit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    qt: 400,
    rr: 1000,
    qtSecondsPerUnit: 0.001,
    rrSecondsPerUnit: 0.001,
  },
  output: { qtSeconds: 0.4, rrSeconds: 1, qtRrRatio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const ecgQtRrUnitConsistencyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/ecg-qt-rr-unit-consistency-term",
    title: "ECG Qt RR Unit Consistency Term Tool",
    description:
      "Unit-normalized supplied QT/RR intervals only; no QT correction formula or risk interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        qt: { type: "number", minimum: 0 },
        rr: { type: "number", exclusiveMinimum: 0 },
        qtSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
        rrSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["qt", "rr", "qtSecondsPerUnit", "rrSecondsPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        qtSeconds: { type: "number" },
        rrSeconds: { type: "number" },
        qtRrRatio: { type: "number" },
      },
      required: ["qtSeconds", "rrSeconds", "qtRrRatio"],
    },
    ports: {
      inputs: [
        {
          id: "qt",
          label: "Qt",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rr",
          label: "Rr",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "qtSecondsPerUnit",
          label: "Qt Seconds Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rrSecondsPerUnit",
          label: "Rr Seconds Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "qtSeconds",
          label: "Qt Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "rrSeconds",
          label: "Rr Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "qtRrRatio",
          label: "Qt Rr Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecgQtRrUnitConsistencyTermTool.execute;
export default ecgQtRrUnitConsistencyTermTool;
