import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyteDistance: number;
  readonly referenceFrontDistance: number;
};
export type Output = { readonly relativeMobility: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyteDistance: { type: "number" },
    referenceFrontDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["analyteDistance", "referenceFrontDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeMobility: { type: "number" } },
  required: ["relativeMobility"],
} as const;
/** Express a signed electrophoretic migration distance relative to an explicitly measured positive reference-front distance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analyteDistance, referenceFrontDistance } = request;
  const compute = (): Output => {
    (H.domain(referenceFrontDistance > 0, "referenceFrontDistance"),
      referenceFrontDistance);
    return { relativeMobility: analyteDistance / referenceFrontDistance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { analyteDistance: 32, referenceFrontDistance: 40 },
  output: { relativeMobility: 0.8 },
} satisfies ToolExample<Input, Output>;
export const electrophoresisRelativeMobilityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/electrophoresis-relative-mobility",
    title: "Electrophoresis Relative Mobility",
    description:
      "Express a signed electrophoretic migration distance relative to an explicitly measured positive reference-front distance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyteDistance: { type: "number" },
        referenceFrontDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["analyteDistance", "referenceFrontDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeMobility: { type: "number" } },
      required: ["relativeMobility"],
    },
    ports: {
      inputs: [
        {
          id: "analyteDistance",
          label: "Analyte Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFrontDistance",
          label: "Reference Front Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeMobility",
          label: "Relative Mobility",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrophoresisRelativeMobilityTool.execute;
export default electrophoresisRelativeMobilityTool;
