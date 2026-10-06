import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly inputUnit: string;
  readonly outputUnit: string;
};
export type Output = { readonly amount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192 },
    outputUnit: { type: "string", maxLength: 8192 },
  },
  required: ["amount", "inputUnit", "outputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amount: { type: "number" } },
  required: ["amount"],
} as const;
/** Convert a records-file storage volume between explicitly selected decimal MB/GB and binary MiB/GiB units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, inputUnit, outputUnit } = request;
  const compute = (): Output => {
    H.domain(amount >= 0, "amount");
    const units = ["MB", "GB", "MiB", "GiB"],
      factors = [1000000, 1000000000, 1048576, 1073741824];
    H.domain(units.includes(inputUnit), "inputUnit");
    H.domain(units.includes(outputUnit), "outputUnit");
    return {
      amount:
        (amount * factors[units.indexOf(inputUnit)]) /
        factors[units.indexOf(outputUnit)],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 1, inputUnit: "GiB", outputUnit: "MiB" },
  output: { amount: 1024 },
} satisfies ToolExample<Input, Output>;
export const recordsFileVolumeUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/records-file-volume-unit-crosswalk",
    title: "Records File Volume Unit Crosswalk",
    description:
      "Convert a records-file storage volume between explicitly selected decimal MB/GB and binary MiB/GiB units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192 },
        outputUnit: { type: "string", maxLength: 8192 },
      },
      required: ["amount", "inputUnit", "outputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { amount: { type: "number" } },
      required: ["amount"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "outputUnit",
          label: "Output Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "amount", label: "Amount", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recordsFileVolumeUnitCrosswalkTool.execute;
export default recordsFileVolumeUnitCrosswalkTool;
