import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bulkVolume: number;
  readonly solidVolume: number;
};
export type Output = {
  readonly voidVolume: number;
  readonly voidFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number", exclusiveMinimum: 0 },
    solidVolume: { type: "number", minimum: 0 },
  },
  required: ["bulkVolume", "solidVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number" },
    voidFraction: { type: "number" },
  },
  required: ["voidVolume", "voidFraction"],
} as const;
/** Describe an explicitly supplied scaffold bulk/solid volume partition without estimating pore connectivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkVolume, solidVolume } = request;
  const compute = (): Output => {
    (H.domain(bulkVolume > 0, "bulkVolume"), bulkVolume);
    H.domain(solidVolume >= 0 && solidVolume <= bulkVolume, "solidVolume");
    return {
      voidVolume: bulkVolume - solidVolume,
      voidFraction: (bulkVolume - solidVolume) / bulkVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bulkVolume: 10, solidVolume: 3 },
  output: { voidVolume: 7, voidFraction: 0.7 },
} satisfies ToolExample<Input, Output>;
export const scaffoldVoidVolumeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/scaffold-void-volume-fraction",
    title: "Scaffold Void Volume Fraction",
    description:
      "Describe an explicitly supplied scaffold bulk/solid volume partition without estimating pore connectivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bulkVolume: { type: "number", exclusiveMinimum: 0 },
        solidVolume: { type: "number", minimum: 0 },
      },
      required: ["bulkVolume", "solidVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number" },
        voidFraction: { type: "number" },
      },
      required: ["voidVolume", "voidFraction"],
    },
    ports: {
      inputs: [
        {
          id: "bulkVolume",
          label: "Bulk Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidVolume",
          label: "Solid Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
        {
          id: "voidFraction",
          label: "Void Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldVoidVolumeFractionTool.execute;
export default scaffoldVoidVolumeFractionTool;
