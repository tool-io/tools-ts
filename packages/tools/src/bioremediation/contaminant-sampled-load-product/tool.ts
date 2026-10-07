import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly sampledVolume: number;
};
export type Output = { readonly sampledMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    sampledVolume: { type: "number", minimum: 0 },
  },
  required: ["concentration", "sampledVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampledMass: { type: "number" } },
  required: ["sampledMass"],
} as const;
/** Multiply explicit compatible concentration and sample volume to obtain sampled mass without predicting remediation performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, sampledVolume } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && sampledVolume >= 0, "concentration");
    return { sampledMass: concentration * sampledVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2.5, sampledVolume: 40 },
  output: { sampledMass: 100 },
} satisfies ToolExample<Input, Output>;
export const contaminantSampledLoadProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioremediation", "biology"],
      keywords: ["bioremediation", "biology"],
    },
    id: "bioremediation/contaminant-sampled-load-product",
    title: "Contaminant Sampled Load Product",
    description:
      "Multiply explicit compatible concentration and sample volume to obtain sampled mass without predicting remediation performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        sampledVolume: { type: "number", minimum: 0 },
      },
      required: ["concentration", "sampledVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sampledMass: { type: "number" } },
      required: ["sampledMass"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampledMass",
          label: "Sampled Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = contaminantSampledLoadProductTool.execute;
export default contaminantSampledLoadProductTool;
