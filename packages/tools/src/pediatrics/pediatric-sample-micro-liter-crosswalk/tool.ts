import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly inputIsMicroliters: boolean;
};
export type Output = {
  readonly microliters: number;
  readonly milliliters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    inputIsMicroliters: { type: "boolean" },
  },
  required: ["volume", "inputIsMicroliters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    microliters: { type: "number" },
    milliliters: { type: "number" },
  },
  required: ["microliters", "milliliters"],
} as const;
/** Convert an explicit sample volume between microliters and milliliters without recommending a pediatric sample volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, inputIsMicroliters } = request;
  const compute = (): Output => {
    H.domain(volume >= 0, "volume");
    return {
      microliters: inputIsMicroliters ? volume : volume * 1000,
      milliliters: inputIsMicroliters ? volume / 1000 : volume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 250, inputIsMicroliters: true },
  output: { microliters: 250, milliliters: 0.25 },
} satisfies ToolExample<Input, Output>;
export const pediatricSampleMicroLiterCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/pediatric-sample-micro-liter-crosswalk",
    title: "Pediatric Sample Microliter Crosswalk",
    description:
      "Convert an explicit sample volume between microliters and milliliters without recommending a pediatric sample volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        inputIsMicroliters: { type: "boolean" },
      },
      required: ["volume", "inputIsMicroliters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        microliters: { type: "number" },
        milliliters: { type: "number" },
      },
      required: ["microliters", "milliliters"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputIsMicroliters",
          label: "Input Is Microliters",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "microliters",
          label: "Microliters",
          valueType: { type: "number" },
        },
        {
          id: "milliliters",
          label: "Milliliters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pediatricSampleMicroLiterCrosswalkTool.execute;
export default pediatricSampleMicroLiterCrosswalkTool;
