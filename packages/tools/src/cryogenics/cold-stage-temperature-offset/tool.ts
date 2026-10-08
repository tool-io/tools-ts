import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredKelvin: number;
  readonly referenceKelvin: number;
};
export type Output = { readonly offsetKelvin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredKelvin: { type: "number", minimum: 0 },
    referenceKelvin: { type: "number", minimum: 0 },
  },
  required: ["measuredKelvin", "referenceKelvin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetKelvin: { type: "number" } },
  required: ["offsetKelvin"],
} as const;
/** Describe a measured cold-stage temperature offset from an explicit nonnegative kelvin reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredKelvin, referenceKelvin } = request;
  const compute = (): Output => {
    H.domain(measuredKelvin >= 0 && referenceKelvin >= 0, "measuredKelvin");
    return { offsetKelvin: measuredKelvin - referenceKelvin };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredKelvin: 4.5, referenceKelvin: 4.2 },
  output: { offsetKelvin: 0.2999999999999998 },
} satisfies ToolExample<Input, Output>;
export const coldStageTemperatureOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cold-stage-temperature-offset",
    title: "Cold Stage Temperature Offset",
    description:
      "Describe a measured cold-stage temperature offset from an explicit nonnegative kelvin reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredKelvin: { type: "number", minimum: 0 },
        referenceKelvin: { type: "number", minimum: 0 },
      },
      required: ["measuredKelvin", "referenceKelvin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetKelvin: { type: "number" } },
      required: ["offsetKelvin"],
    },
    ports: {
      inputs: [
        {
          id: "measuredKelvin",
          label: "Measured Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetKelvin",
          label: "Offset Kelvin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coldStageTemperatureOffsetTool.execute;
export default coldStageTemperatureOffsetTool;
