import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lccn: string };
export type Output = { readonly normalized: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lccn: { type: "string", maxLength: 8192 } },
  required: ["lccn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "string", maxLength: 8192 } },
  required: ["normalized"],
} as const;
/** Normalize the restricted PREFIX+2/4-digit-year-hyphen-serial LCCN input convention by removing spaces and padding the serial to six digits; other LCCN forms are rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lccn } = request;
  const compute = (): Output => {
    const compact = lccn.replace(/ /g, "");
    const match = /^([a-z]{0,3})(\d{2}|\d{4})-(\d{1,6})(?![\s\S])/.exec(
      compact,
    );
    H.domain(match, "lccn");
    return { normalized: match[1] + match[2] + match[3].padStart(6, "0") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lccn: "sn 83-30214" },
  output: { normalized: "sn83030214" },
} satisfies ToolExample<Input, Output>;
export const usNewspaperLccnFieldNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/us-newspaper-lccn-field-normalizer",
    title: "Us Newspaper Lccn Field Normalizer Tool",
    description:
      "Normalize the restricted PREFIX+2/4-digit-year-hyphen-serial LCCN input convention by removing spaces and padding the serial to six digits; other LCCN forms are rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lccn: { type: "string", maxLength: 8192 } },
      required: ["lccn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalized: { type: "string", maxLength: 8192 } },
      required: ["normalized"],
    },
    ports: {
      inputs: [
        {
          id: "lccn",
          label: "Lccn",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = usNewspaperLccnFieldNormalizerTool.execute;
export default usNewspaperLccnFieldNormalizerTool;
