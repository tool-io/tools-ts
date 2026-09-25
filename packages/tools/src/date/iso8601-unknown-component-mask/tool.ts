import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly date: string };
export type Output = {
  readonly yearKnown: boolean;
  readonly monthKnown: boolean;
  readonly dayKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { date: { type: "string", maxLength: 8192 } },
  required: ["date"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearKnown: { type: "boolean" },
    monthKnown: { type: "boolean" },
    dayKnown: { type: "boolean" },
  },
  required: ["yearKnown", "monthKnown", "dayKnown"],
} as const;
/** Compute iso 8601 unknown component mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { date } = input;
  const compute = (): Output => {
    domain(/^(\d{4}|XXXX)-(\d{2}|XX)-(\d{2}|XX)(?![\s\S])/.test(date));
    return {
      yearKnown: !date.slice(0, 4).includes("X"),
      monthKnown: date.slice(5, 7) !== "XX",
      dayKnown: date.slice(8) !== "XX",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { date: "2024-XX-XX" },
  output: { yearKnown: true, monthKnown: false, dayKnown: false },
} satisfies ToolExample<Input, Output>;
export const iso8601UnknownComponentMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/iso8601-unknown-component-mask",
  title: "ISO 8601 Unknown Component Mask Tool",
  description:
    "Compute iso 8601 unknown component mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "date",
        label: "Date",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "yearKnown", label: "Year Known", valueType: { type: "boolean" } },
      {
        id: "monthKnown",
        label: "Month Known",
        valueType: { type: "boolean" },
      },
      { id: "dayKnown", label: "Day Known", valueType: { type: "boolean" } },
    ],
  },
});
export const run = iso8601UnknownComponentMaskTool.execute;
export default iso8601UnknownComponentMaskTool;
