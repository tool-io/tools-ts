import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly headerValue: string };
export type Output = {
  readonly unitToken: string;
  readonly rangeSetText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { headerValue: { type: "string", maxLength: 8192 } },
  required: ["headerValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitToken: { type: "string", maxLength: 8192 },
    rangeSetText: { type: "string", maxLength: 8192 },
  },
  required: ["unitToken", "rangeSetText"],
} as const;
/** Split one explicit HTTP Range field at its unit separator without validating or evaluating the range set. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headerValue } = request;
  const compute = (): Output => {
    return (() => {
      const separator = headerValue.indexOf("=");
      H.domain(
        separator > 0 && separator < headerValue.length - 1,
        "headerValue",
      );
      const unitToken = headerValue.slice(0, separator);
      H.domain(/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(unitToken), "headerValue");
      H.domain(!/[\r\n]/.test(headerValue), "headerValue");
      return { unitToken, rangeSetText: headerValue.slice(separator + 1) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headerValue: "bytes=0-99" },
  output: { unitToken: "bytes", rangeSetText: "0-99" },
} satisfies ToolExample<Input, Output>;
export const httpRangeUnitSeparatorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/http-range-unit-separator-token",
    title: "HTTP Range Unit Separator Token",
    description:
      "Split one explicit HTTP Range field at its unit separator without validating or evaluating the range set.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { headerValue: { type: "string", maxLength: 8192 } },
      required: ["headerValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitToken: { type: "string", maxLength: 8192 },
        rangeSetText: { type: "string", maxLength: 8192 },
      },
      required: ["unitToken", "rangeSetText"],
    },
    ports: {
      inputs: [
        {
          id: "headerValue",
          label: "Header Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "unitToken", label: "Unit Token", valueType: { type: "string" } },
        {
          id: "rangeSetText",
          label: "Range Set Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpRangeUnitSeparatorTokenTool.execute;
export default httpRangeUnitSeparatorTokenTool;
