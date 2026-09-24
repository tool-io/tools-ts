import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedTime: number;
  readonly quantum: number;
  readonly targetLower: number;
  readonly targetUpper: number;
};
export type Output = {
  readonly earliest: number;
  readonly latest: number;
  readonly certainlyInside: boolean;
  readonly possiblyInside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedTime: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    targetLower: { type: "number" },
    targetUpper: { type: "number" },
  },
  required: ["reportedTime", "quantum", "targetLower", "targetUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliest: { type: "number" },
    latest: { type: "number" },
    certainlyInside: { type: "boolean" },
    possiblyInside: { type: "boolean" },
  },
  required: ["earliest", "latest", "certainlyInside", "possiblyInside"],
} as const;
/** Propagate supplied research outcome time resolution without interpreting an intervention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedTime, quantum, targetLower, targetUpper } = request;
  const compute = (): Output => {
    H.positive(quantum);
    H.domain(targetLower <= targetUpper);
    return {
      earliest: reportedTime - quantum / 2,
      latest: reportedTime + quantum / 2,
      certainlyInside:
        reportedTime - quantum / 2 >= targetLower &&
        reportedTime + quantum / 2 <= targetUpper,
      possiblyInside:
        reportedTime + quantum / 2 >= targetLower &&
        reportedTime - quantum / 2 <= targetUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedTime: 10, quantum: 2, targetLower: 8, targetUpper: 12 },
  output: {
    earliest: 9,
    latest: 11,
    certainlyInside: true,
    possiblyInside: true,
  },
} satisfies ToolExample<Input, Output>;
export const researchOutcomeWindowPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/research-outcome-window-precision",
    title: "Research Outcome Window Precision Tool",
    description:
      "Propagate supplied research outcome time resolution without interpreting an intervention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedTime: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        targetLower: { type: "number" },
        targetUpper: { type: "number" },
      },
      required: ["reportedTime", "quantum", "targetLower", "targetUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliest: { type: "number" },
        latest: { type: "number" },
        certainlyInside: { type: "boolean" },
        possiblyInside: { type: "boolean" },
      },
      required: ["earliest", "latest", "certainlyInside", "possiblyInside"],
    },
    ports: {
      inputs: [
        {
          id: "reportedTime",
          label: "Reported Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLower",
          label: "Target Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetUpper",
          label: "Target Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "earliest", label: "Earliest", valueType: { type: "number" } },
        { id: "latest", label: "Latest", valueType: { type: "number" } },
        {
          id: "certainlyInside",
          label: "Certainly Inside",
          valueType: { type: "boolean" },
        },
        {
          id: "possiblyInside",
          label: "Possibly Inside",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchOutcomeWindowPrecisionTool.execute;
export default researchOutcomeWindowPrecisionTool;
