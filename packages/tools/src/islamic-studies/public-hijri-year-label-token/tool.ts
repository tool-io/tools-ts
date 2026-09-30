import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly suppliedEraSuffix: string;
};
export type Output = { readonly year: number; readonly eraSuffix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    suppliedEraSuffix: { type: "string", maxLength: 8192 },
  },
  required: ["label", "suppliedEraSuffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    eraSuffix: { type: "string", maxLength: 8192 },
  },
  required: ["year", "eraSuffix"],
} as const;
/** Read a positive decimal year under an exact caller-supplied public era suffix without calendar conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, suppliedEraSuffix } = request;
  const compute = (): Output => {
    H.domain(suppliedEraSuffix.length > 0 && label.endsWith(suppliedEraSuffix));
    const digits = label.slice(0, -suppliedEraSuffix.length);
    H.domain(/^[1-9]\d*(?![\s\S])/.test(digits));
    const year = Number(digits);
    H.integer(year, 1);
    return { year, eraSuffix: suppliedEraSuffix };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "1447 AH", suppliedEraSuffix: " AH" },
  output: { year: 1447, eraSuffix: " AH" },
} satisfies ToolExample<Input, Output>;
export const publicHijriYearLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/public-hijri-year-label-token",
    title: "Public Hijri Year Label Token Tool",
    description:
      "Read a positive decimal year under an exact caller-supplied public era suffix without calendar conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        suppliedEraSuffix: { type: "string", maxLength: 8192 },
      },
      required: ["label", "suppliedEraSuffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        eraSuffix: { type: "string", maxLength: 8192 },
      },
      required: ["year", "eraSuffix"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEraSuffix",
          label: "Supplied Era Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "eraSuffix", label: "Era Suffix", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicHijriYearLabelTokenTool.execute;
export default publicHijriYearLabelTokenTool;
