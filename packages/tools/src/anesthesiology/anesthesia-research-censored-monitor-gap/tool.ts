import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastObserved: number;
  readonly nextObserved: number;
  readonly monitoringEnd: number;
  readonly hasNext: boolean;
};
export type Output = {
  readonly lowerGap: number;
  readonly upperGapPresent: boolean;
  readonly upperGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastObserved: { type: "number" },
    nextObserved: { type: "number" },
    monitoringEnd: { type: "number" },
    hasNext: { type: "boolean" },
  },
  required: ["lastObserved", "nextObserved", "monitoringEnd", "hasNext"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerGap: { type: "number" },
    upperGapPresent: { type: "boolean" },
    upperGap: { type: "number" },
  },
  required: ["lowerGap", "upperGapPresent", "upperGap"],
} as const;
/** Represent an observed gap or right-censored lower bound; upperGap is zero when absent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastObserved, nextObserved, monitoringEnd, hasNext } = request;
  const compute = (): Output => {
    H.domain(
      monitoringEnd >= lastObserved &&
        (!hasNext ||
          (nextObserved >= lastObserved && nextObserved <= monitoringEnd)),
      "nextObserved",
    );
    return {
      lowerGap: hasNext
        ? nextObserved - lastObserved
        : monitoringEnd - lastObserved,
      upperGapPresent: hasNext,
      upperGap: hasNext ? nextObserved - lastObserved : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lastObserved: 10,
    nextObserved: 18,
    monitoringEnd: 20,
    hasNext: true,
  },
  output: { lowerGap: 8, upperGapPresent: true, upperGap: 8 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaResearchCensoredMonitorGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/anesthesia-research-censored-monitor-gap",
      title: "Anesthesia Research Censored Monitor Gap Tool",
      description:
        "Represent an observed gap or right-censored lower bound; upperGap is zero when absent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lastObserved: { type: "number" },
          nextObserved: { type: "number" },
          monitoringEnd: { type: "number" },
          hasNext: { type: "boolean" },
        },
        required: ["lastObserved", "nextObserved", "monitoringEnd", "hasNext"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerGap: { type: "number" },
          upperGapPresent: { type: "boolean" },
          upperGap: { type: "number" },
        },
        required: ["lowerGap", "upperGapPresent", "upperGap"],
      },
      ports: {
        inputs: [
          {
            id: "lastObserved",
            label: "Last Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextObserved",
            label: "Next Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "monitoringEnd",
            label: "Monitoring End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hasNext",
            label: "Has Next",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "lowerGap", label: "Lower Gap", valueType: { type: "number" } },
          {
            id: "upperGapPresent",
            label: "Upper Gap Present",
            valueType: { type: "boolean" },
          },
          { id: "upperGap", label: "Upper Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = anesthesiaResearchCensoredMonitorGapTool.execute;
export default anesthesiaResearchCensoredMonitorGapTool;
