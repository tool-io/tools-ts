import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delay: number;
  readonly basePerUnit: number;
  readonly referenceDelayBase: number;
};
export type Output = {
  readonly delayBase: number;
  readonly framingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delay: { type: "number", minimum: 0 },
    basePerUnit: { type: "number", exclusiveMinimum: 0 },
    referenceDelayBase: { type: "number", minimum: 0 },
  },
  required: ["delay", "basePerUnit", "referenceDelayBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delayBase: { type: "number" }, framingGap: { type: "number" } },
  required: ["delayBase", "framingGap"],
} as const;
/** Normalize explicitly supplied duration units without inferring a behavioral framing effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delay, basePerUnit, referenceDelayBase } = request;
  const compute = (): Output => {
    H.domain(delay >= 0 && referenceDelayBase >= 0);
    H.positive(basePerUnit);
    return {
      delayBase: delay * basePerUnit,
      framingGap: delay * basePerUnit - referenceDelayBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delay: 2, basePerUnit: 7, referenceDelayBase: 10 },
  output: { delayBase: 14, framingGap: 4 },
} satisfies ToolExample<Input, Output>;
export const delayUnitFramingOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/delay-unit-framing-offset",
    title: "Delay Unit Framing Offset Tool",
    description:
      "Normalize explicitly supplied duration units without inferring a behavioral framing effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delay: { type: "number", minimum: 0 },
        basePerUnit: { type: "number", exclusiveMinimum: 0 },
        referenceDelayBase: { type: "number", minimum: 0 },
      },
      required: ["delay", "basePerUnit", "referenceDelayBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delayBase: { type: "number" },
        framingGap: { type: "number" },
      },
      required: ["delayBase", "framingGap"],
    },
    ports: {
      inputs: [
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basePerUnit",
          label: "Base Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDelayBase",
          label: "Reference Delay Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "delayBase", label: "Delay Base", valueType: { type: "number" } },
        {
          id: "framingGap",
          label: "Framing Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = delayUnitFramingOffsetTool.execute;
export default delayUnitFramingOffsetTool;
