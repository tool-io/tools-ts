import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentCode: string;
  readonly volume: number;
  readonly volumeBasis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentCode: { type: "string", maxLength: 8192, minLength: 1 },
    volume: { type: "number", minimum: 0 },
    volumeBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["instrumentCode", "volume", "volumeBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied market-volume basis without treating volume as a complete liquidity measure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentCode, volume, volumeBasis } = request;
  const compute = (): Output => {
    H.domain(
      instrumentCode.length > 0 && volumeBasis.length > 0,
      "instrumentCode",
    );
    H.domain(volume >= 0, "volume");
    return {
      label: instrumentCode + "; volume=" + volume + " [" + volumeBasis + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { instrumentCode: "ABC", volume: 1200, volumeBasis: "shares" },
  output: { label: "ABC; volume=1200 [shares]" },
} satisfies ToolExample<Input, Output>;
export const liquidityVolumeBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/liquidity-volume-basis-label",
    title: "Liquidity Volume Basis Label",
    description:
      "Label a supplied market-volume basis without treating volume as a complete liquidity measure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentCode: { type: "string", maxLength: 8192, minLength: 1 },
        volume: { type: "number", minimum: 0 },
        volumeBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["instrumentCode", "volume", "volumeBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "instrumentCode",
          label: "Instrument Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumeBasis",
          label: "Volume Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = liquidityVolumeBasisLabelTool.execute;
export default liquidityVolumeBasisLabelTool;
