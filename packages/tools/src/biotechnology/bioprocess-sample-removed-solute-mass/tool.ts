import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleVolume: number;
  readonly suppliedSoluteConcentration: number;
};
export type Output = { readonly removedSoluteAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleVolume: { type: "number", minimum: 0 },
    suppliedSoluteConcentration: { type: "number", minimum: 0 },
  },
  required: ["sampleVolume", "suppliedSoluteConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { removedSoluteAmount: { type: "number" } },
  required: ["removedSoluteAmount"],
} as const;
/** Calculate a removed-solute amount from explicit compatible sample volume and concentration without process-control recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleVolume, suppliedSoluteConcentration } = request;
  const compute = (): Output => {
    H.domain(
      sampleVolume >= 0 && suppliedSoluteConcentration >= 0,
      "sampleVolume",
    );
    return { removedSoluteAmount: sampleVolume * suppliedSoluteConcentration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleVolume: 2, suppliedSoluteConcentration: 3 },
  output: { removedSoluteAmount: 6 },
} satisfies ToolExample<Input, Output>;
export const bioprocessSampleRemovedSoluteMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/bioprocess-sample-removed-solute-mass",
    title: "Bioprocess Sample Removed Solute Mass",
    description:
      "Calculate a removed-solute amount from explicit compatible sample volume and concentration without process-control recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleVolume: { type: "number", minimum: 0 },
        suppliedSoluteConcentration: { type: "number", minimum: 0 },
      },
      required: ["sampleVolume", "suppliedSoluteConcentration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { removedSoluteAmount: { type: "number" } },
      required: ["removedSoluteAmount"],
    },
    ports: {
      inputs: [
        {
          id: "sampleVolume",
          label: "Sample Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSoluteConcentration",
          label: "Supplied Solute Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedSoluteAmount",
          label: "Removed Solute Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioprocessSampleRemovedSoluteMassTool.execute;
export default bioprocessSampleRemovedSoluteMassTool;
