import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePressure: number;
  readonly measuredPeakPressure: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePressure: { type: "number" },
    measuredPeakPressure: { type: "number" },
  },
  required: ["referencePressure", "measuredPeakPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit reference pressure from measured tympanogram peak pressure without interpreting middle-ear status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePressure, measuredPeakPressure } = request;
  const compute = (): Output => {
    return { signedGap: measuredPeakPressure - referencePressure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referencePressure: 12, measuredPeakPressure: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const tympanogramPeakReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/tympanogram-peak-reference-offset",
    title: "Tympanogram Peak Reference Offset",
    description:
      "Subtract explicit reference pressure from measured tympanogram peak pressure without interpreting middle-ear status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referencePressure: { type: "number" },
        measuredPeakPressure: { type: "number" },
      },
      required: ["referencePressure", "measuredPeakPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPeakPressure",
          label: "Measured Peak Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tympanogramPeakReferenceOffsetTool.execute;
export default tympanogramPeakReferenceOffsetTool;
