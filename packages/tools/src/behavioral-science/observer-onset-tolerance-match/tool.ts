import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOnsetSeconds: number;
  readonly secondOnsetSeconds: number;
  readonly toleranceSeconds: number;
};
export type Output = {
  readonly absoluteGapSeconds: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOnsetSeconds: { type: "number" },
    secondOnsetSeconds: { type: "number" },
    toleranceSeconds: { type: "number", minimum: 0 },
  },
  required: ["firstOnsetSeconds", "secondOnsetSeconds", "toleranceSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteGapSeconds: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["absoluteGapSeconds", "withinTolerance"],
} as const;
/** Compare two observers’ recorded event onsets using an explicitly inclusive time tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOnsetSeconds, secondOnsetSeconds, toleranceSeconds } = request;
  const compute = (): Output => {
    H.domain(toleranceSeconds >= 0, "toleranceSeconds");
    return {
      absoluteGapSeconds: Math.abs(firstOnsetSeconds - secondOnsetSeconds),
      withinTolerance:
        Math.abs(firstOnsetSeconds - secondOnsetSeconds) <= toleranceSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOnsetSeconds: 10,
    secondOnsetSeconds: 10.2,
    toleranceSeconds: 0.3,
  },
  output: { absoluteGapSeconds: 0.1999999999999993, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const observerOnsetToleranceMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/observer-onset-tolerance-match",
    title: "Observer Onset Tolerance Match",
    description:
      "Compare two observers’ recorded event onsets using an explicitly inclusive time tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOnsetSeconds: { type: "number" },
        secondOnsetSeconds: { type: "number" },
        toleranceSeconds: { type: "number", minimum: 0 },
      },
      required: ["firstOnsetSeconds", "secondOnsetSeconds", "toleranceSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteGapSeconds: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["absoluteGapSeconds", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "firstOnsetSeconds",
          label: "First Onset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOnsetSeconds",
          label: "Second Onset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toleranceSeconds",
          label: "Tolerance Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteGapSeconds",
          label: "Absolute Gap Seconds",
          valueType: { type: "number" },
        },
        {
          id: "withinTolerance",
          label: "Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = observerOnsetToleranceMatchTool.execute;
export default observerOnsetToleranceMatchTool;
