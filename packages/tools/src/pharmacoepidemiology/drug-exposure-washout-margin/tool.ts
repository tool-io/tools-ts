import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly suppliedWashoutDays: number;
};
export type Output = {
  readonly marginDays: number;
  readonly meetsSuppliedInterval: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "number", minimum: 0 },
    suppliedWashoutDays: { type: "number", minimum: 0 },
  },
  required: ["elapsedDays", "suppliedWashoutDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginDays: { type: "number" },
    meetsSuppliedInterval: { type: "boolean" },
  },
  required: ["marginDays", "meetsSuppliedInterval"],
} as const;
/** Compare an explicit elapsed interval with a supplied washout interval without selecting a clinical or study requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDays, suppliedWashoutDays } = request;
  const compute = (): Output => {
    H.domain(elapsedDays >= 0 && suppliedWashoutDays >= 0, "elapsedDays");
    return {
      marginDays: elapsedDays - suppliedWashoutDays,
      meetsSuppliedInterval: elapsedDays >= suppliedWashoutDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedDays: 45, suppliedWashoutDays: 30 },
  output: { marginDays: 15, meetsSuppliedInterval: true },
} satisfies ToolExample<Input, Output>;
export const drugExposureWashoutMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/drug-exposure-washout-margin",
    title: "Drug Exposure Washout Margin",
    description:
      "Compare an explicit elapsed interval with a supplied washout interval without selecting a clinical or study requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "number", minimum: 0 },
        suppliedWashoutDays: { type: "number", minimum: 0 },
      },
      required: ["elapsedDays", "suppliedWashoutDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginDays: { type: "number" },
        meetsSuppliedInterval: { type: "boolean" },
      },
      required: ["marginDays", "meetsSuppliedInterval"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWashoutDays",
          label: "Supplied Washout Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginDays",
          label: "Margin Days",
          valueType: { type: "number" },
        },
        {
          id: "meetsSuppliedInterval",
          label: "Meets Supplied Interval",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = drugExposureWashoutMarginTool.execute;
export default drugExposureWashoutMarginTool;
