import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDuration: number;
  readonly secondDuration: number;
  readonly doubleCounted: number;
  readonly observedWindow: number;
};
export type Output = {
  readonly correctedDuration: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDuration: { type: "number", minimum: 0 },
    secondDuration: { type: "number", minimum: 0 },
    doubleCounted: { type: "number", minimum: 0 },
    observedWindow: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstDuration",
    "secondDuration",
    "doubleCounted",
    "observedWindow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedDuration: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["correctedDuration", "fraction"],
} as const;
/** Calculate behavioral duration overlap correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDuration, secondDuration, doubleCounted, observedWindow } =
    request;
  const compute = (): Output => {
    H.positive(observedWindow);
    H.domain(
      firstDuration >= 0 &&
        secondDuration >= 0 &&
        doubleCounted >= 0 &&
        doubleCounted <= Math.min(firstDuration, secondDuration) &&
        firstDuration + secondDuration - doubleCounted <= observedWindow,
    );
    return {
      correctedDuration: firstDuration + secondDuration - doubleCounted,
      fraction:
        (firstDuration + secondDuration - doubleCounted) / observedWindow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDuration: 20,
    secondDuration: 30,
    doubleCounted: 10,
    observedWindow: 100,
  },
  output: { correctedDuration: 40, fraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const behavioralDurationOverlapCorrectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-science/behavioral-duration-overlap-correction",
      title: "Behavioral Duration Overlap Correction Tool",
      description:
        "Calculate behavioral duration overlap correction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDuration: { type: "number", minimum: 0 },
          secondDuration: { type: "number", minimum: 0 },
          doubleCounted: { type: "number", minimum: 0 },
          observedWindow: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "firstDuration",
          "secondDuration",
          "doubleCounted",
          "observedWindow",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedDuration: { type: "number" },
          fraction: { type: "number" },
        },
        required: ["correctedDuration", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "firstDuration",
            label: "First Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondDuration",
            label: "Second Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "doubleCounted",
            label: "Double Counted",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedWindow",
            label: "Observed Window",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedDuration",
            label: "Corrected Duration",
            valueType: { type: "number" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = behavioralDurationOverlapCorrectionTool.execute;
export default behavioralDurationOverlapCorrectionTool;
