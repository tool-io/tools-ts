import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly measuredVolume: number;
  readonly referenceFactor: number;
};
export type Output = { readonly measuredFactor: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    measuredVolume: { type: "number", minimum: 0 },
    referenceFactor: { type: "number", minimum: 0 },
  },
  required: ["initialVolume", "measuredVolume", "referenceFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { measuredFactor: { type: "number" }, gap: { type: "number" } },
  required: ["measuredFactor", "gap"],
} as const;
/** Calculate biomaterial swell reference volume gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, measuredVolume, referenceFactor } = request;
  const compute = (): Output => {
    H.positive(initialVolume);
    H.domain(measuredVolume >= 0 && referenceFactor >= 0);
    return {
      measuredFactor: measuredVolume / initialVolume,
      gap: measuredVolume / initialVolume - referenceFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialVolume: 10, measuredVolume: 15, referenceFactor: 1.2 },
  output: { measuredFactor: 1.5, gap: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const biomaterialSwellReferenceVolumeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/biomaterial-swell-reference-volume-gap",
    title: "Biomaterial Swell Reference Volume Gap Tool",
    description:
      "Calculate biomaterial swell reference volume gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", exclusiveMinimum: 0 },
        measuredVolume: { type: "number", minimum: 0 },
        referenceFactor: { type: "number", minimum: 0 },
      },
      required: ["initialVolume", "measuredVolume", "referenceFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredFactor: { type: "number" },
        gap: { type: "number" },
      },
      required: ["measuredFactor", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredVolume",
          label: "Measured Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFactor",
          label: "Reference Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredFactor",
          label: "Measured Factor",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biomaterialSwellReferenceVolumeGapTool.execute;
export default biomaterialSwellReferenceVolumeGapTool;
