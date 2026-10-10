import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedArea: number;
  readonly observationHours: number;
};
export type Output = { readonly areaHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedArea: { type: "number", minimum: 0 },
    observationHours: { type: "number", minimum: 0 },
  },
  required: ["observedArea", "observationHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaHours: { type: "number" } },
  required: ["areaHours"],
} as const;
/** Multiply an explicitly observed public-space area by duration without inferring attendance or visibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedArea, observationHours } = request;
  const compute = (): Output => {
    H.domain(observedArea >= 0 && observationHours >= 0, "observedArea");
    return { areaHours: observedArea * observationHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedArea: 200, observationHours: 2.5 },
  output: { areaHours: 500 },
} satisfies ToolExample<Input, Output>;
export const publicSpaceObservationAreaTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/public-space-observation-area-time",
    title: "Public Space Observation Area Time",
    description:
      "Multiply an explicitly observed public-space area by duration without inferring attendance or visibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedArea: { type: "number", minimum: 0 },
        observationHours: { type: "number", minimum: 0 },
      },
      required: ["observedArea", "observationHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { areaHours: { type: "number" } },
      required: ["areaHours"],
    },
    ports: {
      inputs: [
        {
          id: "observedArea",
          label: "Observed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationHours",
          label: "Observation Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "areaHours", label: "Area Hours", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicSpaceObservationAreaTimeTool.execute;
export default publicSpaceObservationAreaTimeTool;
