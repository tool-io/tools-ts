import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentPoints: number;
  readonly maximumFinalPoints: number;
  readonly nextItemMaximum: number;
  readonly targetFraction: number;
};
export type Output = { readonly needed: number; readonly possible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentPoints: { type: "number", minimum: 0 },
    maximumFinalPoints: { type: "number", exclusiveMinimum: 0 },
    nextItemMaximum: { type: "number", minimum: 0 },
    targetFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "currentPoints",
    "maximumFinalPoints",
    "nextItemMaximum",
    "targetFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { needed: { type: "number" }, possible: { type: "boolean" } },
  required: ["needed", "possible"],
} as const;
/** Calculate grade boundary needed next item mark from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentPoints, maximumFinalPoints, nextItemMaximum, targetFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      currentPoints >= 0 && maximumFinalPoints > 0 && nextItemMaximum >= 0,
    );
    H.probability(targetFraction);
    return {
      needed: Math.max(0, targetFraction * maximumFinalPoints - currentPoints),
      possible:
        targetFraction * maximumFinalPoints - currentPoints <= nextItemMaximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentPoints: 70,
    maximumFinalPoints: 100,
    nextItemMaximum: 20,
    targetFraction: 0.8,
  },
  output: { needed: 10, possible: true },
} satisfies ToolExample<Input, Output>;
export const gradeBoundaryNeededNextItemMarkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/grade-boundary-needed-next-item-mark",
    title: "Grade Boundary Needed Next Item Mark Tool",
    description:
      "Calculate grade boundary needed next item mark from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentPoints: { type: "number", minimum: 0 },
        maximumFinalPoints: { type: "number", exclusiveMinimum: 0 },
        nextItemMaximum: { type: "number", minimum: 0 },
        targetFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "currentPoints",
        "maximumFinalPoints",
        "nextItemMaximum",
        "targetFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { needed: { type: "number" }, possible: { type: "boolean" } },
      required: ["needed", "possible"],
    },
    ports: {
      inputs: [
        {
          id: "currentPoints",
          label: "Current Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumFinalPoints",
          label: "Maximum Final Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextItemMaximum",
          label: "Next Item Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetFraction",
          label: "Target Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "needed", label: "Needed", valueType: { type: "number" } },
        { id: "possible", label: "Possible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gradeBoundaryNeededNextItemMarkTool.execute;
export default gradeBoundaryNeededNextItemMarkTool;
