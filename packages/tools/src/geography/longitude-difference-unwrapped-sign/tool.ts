import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLongitudeDegrees: number;
  readonly secondLongitudeDegrees: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLongitudeDegrees: { type: "number" },
    secondLongitudeDegrees: { type: "number" },
  },
  required: ["firstLongitudeDegrees", "secondLongitudeDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit unwrapped longitudes in degrees without choosing a shortest dateline displacement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLongitudeDegrees, secondLongitudeDegrees } = request;
  const compute = (): Output => {
    return { signedGap: secondLongitudeDegrees - firstLongitudeDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLongitudeDegrees: 12, secondLongitudeDegrees: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const longitudeDifferenceUnwrappedSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geography", "earth and environmental sciences"],
      keywords: ["geography", "earth and environmental sciences"],
    },
    id: "geography/longitude-difference-unwrapped-sign",
    title: "Longitude Difference Unwrapped Sign",
    description:
      "Subtract explicit unwrapped longitudes in degrees without choosing a shortest dateline displacement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLongitudeDegrees: { type: "number" },
        secondLongitudeDegrees: { type: "number" },
      },
      required: ["firstLongitudeDegrees", "secondLongitudeDegrees"],
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
          id: "firstLongitudeDegrees",
          label: "First Longitude Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLongitudeDegrees",
          label: "Second Longitude Degrees",
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
export const run = longitudeDifferenceUnwrappedSignTool.execute;
export default longitudeDifferenceUnwrappedSignTool;
