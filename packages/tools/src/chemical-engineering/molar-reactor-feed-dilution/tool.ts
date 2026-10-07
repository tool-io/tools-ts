import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly soluteMolarFlow: number;
  readonly totalVolumeFlow: number;
};
export type Output = { readonly feedMolarConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soluteMolarFlow: { type: "number", minimum: 0 },
    totalVolumeFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["soluteMolarFlow", "totalVolumeFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { feedMolarConcentration: { type: "number" } },
  required: ["feedMolarConcentration"],
} as const;
/** Divide supplied solute molar flow by positive total volumetric reactor feed flow in compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { soluteMolarFlow, totalVolumeFlow } = request;
  const compute = (): Output => {
    H.domain(soluteMolarFlow >= 0, "soluteMolarFlow");
    (H.domain(
      Number.isFinite(totalVolumeFlow) && totalVolumeFlow > 0,
      "totalVolumeFlow",
    ),
      totalVolumeFlow);
    return { feedMolarConcentration: soluteMolarFlow / totalVolumeFlow };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { soluteMolarFlow: 12, totalVolumeFlow: 3 },
  output: { feedMolarConcentration: 4 },
} satisfies ToolExample<Input, Output>;
export const molarReactorFeedDilutionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/molar-reactor-feed-dilution",
    title: "Molar Reactor Feed Dilution",
    description:
      "Divide supplied solute molar flow by positive total volumetric reactor feed flow in compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        soluteMolarFlow: { type: "number", minimum: 0 },
        totalVolumeFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["soluteMolarFlow", "totalVolumeFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { feedMolarConcentration: { type: "number" } },
      required: ["feedMolarConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "soluteMolarFlow",
          label: "Solute Molar Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVolumeFlow",
          label: "Total Volume Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "feedMolarConcentration",
          label: "Feed Molar Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molarReactorFeedDilutionTool.execute;
export default molarReactorFeedDilutionTool;
