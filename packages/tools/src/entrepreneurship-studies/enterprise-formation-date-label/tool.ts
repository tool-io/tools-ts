import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enterpriseCode: string;
  readonly formationDate: string;
  readonly dateSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enterpriseCode: { type: "string", maxLength: 8192, minLength: 1 },
    formationDate: { type: "string", maxLength: 8192 },
    dateSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["enterpriseCode", "formationDate", "dateSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit calendar date and source to an enterprise record without establishing legal formation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enterpriseCode, formationDate, dateSource } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(
      enterpriseCode.length > 0 && dateSource.length > 0,
      "enterpriseCode",
    );
    namedDate(formationDate, "formationDate");
    return {
      label:
        enterpriseCode +
        "; formation=" +
        formationDate +
        " [" +
        dateSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    enterpriseCode: "V17",
    formationDate: "2026-03-15",
    dateSource: "Registry extract",
  },
  output: { label: "V17; formation=2026-03-15 [Registry extract]" },
} satisfies ToolExample<Input, Output>;
export const enterpriseFormationDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/enterprise-formation-date-label",
    title: "Enterprise Formation Date Label",
    description:
      "Attach an explicit calendar date and source to an enterprise record without establishing legal formation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enterpriseCode: { type: "string", maxLength: 8192, minLength: 1 },
        formationDate: { type: "string", maxLength: 8192 },
        dateSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["enterpriseCode", "formationDate", "dateSource"],
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
          id: "enterpriseCode",
          label: "Enterprise Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "formationDate",
          label: "Formation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateSource",
          label: "Date Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = enterpriseFormationDateLabelTool.execute;
export default enterpriseFormationDateLabelTool;
