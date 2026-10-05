import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly givenNames: string;
  readonly firstSurname: string;
  readonly secondSurname: string;
  readonly includeSecond: boolean;
};
export type Output = { readonly displayName: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    givenNames: { type: "string", maxLength: 8192 },
    firstSurname: { type: "string", maxLength: 8192 },
    secondSurname: { type: "string", maxLength: 8192 },
    includeSecond: { type: "boolean" },
  },
  required: ["givenNames", "firstSurname", "secondSurname", "includeSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayName: { type: "string", maxLength: 8192 } },
  required: ["displayName"],
} as const;
/** Assemble an explicitly preferred given-name and surname display choice without inferring family relationships or surname order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { givenNames, firstSurname, secondSurname, includeSecond } = request;
  const compute = (): Output => {
    H.domain(givenNames.length > 0 && firstSurname.length > 0, "givenNames");
    H.domain(!includeSecond || secondSurname.length > 0, "includeSecond");
    return {
      displayName:
        givenNames +
        " " +
        firstSurname +
        (includeSecond ? " " + secondSurname : ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    givenNames: "Ana",
    firstSurname: "García",
    secondSurname: "López",
    includeSecond: true,
  },
  output: { displayName: "Ana García López" },
} satisfies ToolExample<Input, Output>;
export const latinAmericanDoubleSurnameDisplayChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/latin-american-double-surname-display-choice",
      title: "Latin American Double Surname Display Choice Tool",
      description:
        "Assemble an explicitly preferred given-name and surname display choice without inferring family relationships or surname order.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          givenNames: { type: "string", maxLength: 8192 },
          firstSurname: { type: "string", maxLength: 8192 },
          secondSurname: { type: "string", maxLength: 8192 },
          includeSecond: { type: "boolean" },
        },
        required: [
          "givenNames",
          "firstSurname",
          "secondSurname",
          "includeSecond",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { displayName: { type: "string", maxLength: 8192 } },
        required: ["displayName"],
      },
      ports: {
        inputs: [
          {
            id: "givenNames",
            label: "Given Names",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstSurname",
            label: "First Surname",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondSurname",
            label: "Second Surname",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "includeSecond",
            label: "Include Second",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "displayName",
            label: "Display Name",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = latinAmericanDoubleSurnameDisplayChoiceTool.execute;
export default latinAmericanDoubleSurnameDisplayChoiceTool;
