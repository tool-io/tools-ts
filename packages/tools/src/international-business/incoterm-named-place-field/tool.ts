import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ruleCode: string;
  readonly namedPlace: string;
  readonly editionText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ruleCode: { type: "string", maxLength: 8192, minLength: 1 },
    namedPlace: { type: "string", maxLength: 8192, minLength: 1 },
    editionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ruleCode", "namedPlace", "editionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly supplied trade-rule and named-place wording without validating Incoterms obligations or rule applicability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ruleCode, namedPlace, editionText } = request;
  const compute = (): Output => {
    H.domain(
      ruleCode.length > 0 && namedPlace.length > 0 && editionText.length > 0,
      "ruleCode",
    );
    return { label: ruleCode + " " + namedPlace + " [" + editionText + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ruleCode: "FCA",
    namedPlace: "Warehouse A",
    editionText: "Incoterms 2020",
  },
  output: { label: "FCA Warehouse A [Incoterms 2020]" },
} satisfies ToolExample<Input, Output>;
export const incotermNamedPlaceFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/incoterm-named-place-field",
    title: "Incoterm Named Place Field",
    description:
      "Format explicitly supplied trade-rule and named-place wording without validating Incoterms obligations or rule applicability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ruleCode: { type: "string", maxLength: 8192, minLength: 1 },
        namedPlace: { type: "string", maxLength: 8192, minLength: 1 },
        editionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["ruleCode", "namedPlace", "editionText"],
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
          id: "ruleCode",
          label: "Rule Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "namedPlace",
          label: "Named Place",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editionText",
          label: "Edition Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = incotermNamedPlaceFieldTool.execute;
export default incotermNamedPlaceFieldTool;
