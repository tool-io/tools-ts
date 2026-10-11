import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly advertisedArea: number;
  readonly measuredArea: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    advertisedArea: { type: "number" },
    measuredArea: { type: "number" },
  },
  required: ["advertisedArea", "measuredArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit advertised area from measured area on the same supplied measurement basis without assessing legal claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { advertisedArea, measuredArea } = request;
  const compute = (): Output => {
    return { signedGap: measuredArea - advertisedArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { advertisedArea: 12, measuredArea: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const propertyMeasuredAdvertisedAreaGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/property-measured-advertised-area-gap",
    title: "Property Measured Advertised Area Gap",
    description:
      "Subtract explicit advertised area from measured area on the same supplied measurement basis without assessing legal claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        advertisedArea: { type: "number" },
        measuredArea: { type: "number" },
      },
      required: ["advertisedArea", "measuredArea"],
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
          id: "advertisedArea",
          label: "Advertised Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredArea",
          label: "Measured Area",
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
export const run = propertyMeasuredAdvertisedAreaGapTool.execute;
export default propertyMeasuredAdvertisedAreaGapTool;
