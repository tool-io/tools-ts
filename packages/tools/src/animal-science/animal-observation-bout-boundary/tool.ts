import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly boutStart: number;
  readonly boutEnd: number;
};
export type Output = { readonly withinBout: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number" },
    boutStart: { type: "number" },
    boutEnd: { type: "number" },
  },
  required: ["observedTime", "boutStart", "boutEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinBout: { type: "boolean" } },
  required: ["withinBout"],
} as const;
/** Check supplied observation-time membership in a half-open animal behavior bout interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, boutStart, boutEnd } = request;
  const compute = (): Output => {
    H.domain(boutEnd >= boutStart, "boutEnd");
    return { withinBout: observedTime >= boutStart && observedTime < boutEnd };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTime: 12, boutStart: 10, boutEnd: 15 },
  output: { withinBout: true },
} satisfies ToolExample<Input, Output>;
export const animalObservationBoutBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/animal-observation-bout-boundary",
    title: "Animal Observation Bout Boundary",
    description:
      "Check supplied observation-time membership in a half-open animal behavior bout interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number" },
        boutStart: { type: "number" },
        boutEnd: { type: "number" },
      },
      required: ["observedTime", "boutStart", "boutEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinBout: { type: "boolean" } },
      required: ["withinBout"],
    },
    ports: {
      inputs: [
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boutStart",
          label: "Bout Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boutEnd",
          label: "Bout End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withinBout",
          label: "Within Bout",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalObservationBoutBoundaryTool.execute;
export default animalObservationBoutBoundaryTool;
