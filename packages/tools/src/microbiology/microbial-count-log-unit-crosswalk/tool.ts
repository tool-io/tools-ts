import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly direction: string };
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    direction: {
      type: "string",
      maxLength: 8192,
      enum: ["linear-to-log10", "log10-to-linear"],
    },
  },
  required: ["value", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Convert explicit compatible microbial count concentrations between linear and base-10 logarithmic forms without interpreting detection limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, direction } = request;
  const compute = (): Output => {
    H.domain(
      ["linear-to-log10", "log10-to-linear"].includes(direction),
      "direction",
    );
    H.domain(direction !== "linear-to-log10" || value > 0, "value");
    const converted =
      direction === "linear-to-log10" ? Math.log10(value) : 10 ** value;
    H.domain(
      direction !== "log10-to-linear" || converted > 0,
      "value",
      "The count is below the representable positive numeric range.",
    );
    return { converted };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 1000, direction: "linear-to-log10" },
  output: { converted: 3 },
} satisfies ToolExample<Input, Output>;
export const microbialCountLogUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/microbial-count-log-unit-crosswalk",
    title: "Microbial Count Log Unit Crosswalk",
    description:
      "Convert explicit compatible microbial count concentrations between linear and base-10 logarithmic forms without interpreting detection limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["linear-to-log10", "log10-to-linear"],
        },
      },
      required: ["value", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = microbialCountLogUnitCrosswalkTool.execute;
export default microbialCountLogUnitCrosswalkTool;
