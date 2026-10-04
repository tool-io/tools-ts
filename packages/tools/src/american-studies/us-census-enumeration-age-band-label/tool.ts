import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly age: number;
  readonly lowerAge: number;
  readonly upperAge: number;
};
export type Output = { readonly label: string; readonly inBand: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "integer", minimum: 0 },
    lowerAge: { type: "integer", minimum: 0 },
    upperAge: { type: "integer" },
  },
  required: ["age", "lowerAge", "upperAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    inBand: { type: "boolean" },
  },
  required: ["label", "inBand"],
} as const;
/** Check an explicitly supplied inclusive age band, without assuming a particular historical census age schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { age, lowerAge, upperAge } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(age) && age >= 0 && age <= Number.MAX_SAFE_INTEGER,
      "age",
    ),
      age);
    (H.domain(
      Number.isSafeInteger(lowerAge) &&
        lowerAge >= 0 &&
        lowerAge <= Number.MAX_SAFE_INTEGER,
      "lowerAge",
    ),
      lowerAge);
    (H.domain(
      Number.isSafeInteger(upperAge) &&
        upperAge >= lowerAge &&
        upperAge <= Number.MAX_SAFE_INTEGER,
      "upperAge",
    ),
      upperAge);
    return {
      label: lowerAge + "–" + upperAge + " years",
      inBand: age >= lowerAge && age <= upperAge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { age: 27, lowerAge: 25, upperAge: 34 },
  output: { label: "25–34 years", inBand: true },
} satisfies ToolExample<Input, Output>;
export const usCensusEnumerationAgeBandLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/us-census-enumeration-age-band-label",
    title: "Us Census Enumeration Age Band Label Tool",
    description:
      "Check an explicitly supplied inclusive age band, without assuming a particular historical census age schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "integer", minimum: 0 },
        lowerAge: { type: "integer", minimum: 0 },
        upperAge: { type: "integer" },
      },
      required: ["age", "lowerAge", "upperAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        inBand: { type: "boolean" },
      },
      required: ["label", "inBand"],
    },
    ports: {
      inputs: [
        {
          id: "age",
          label: "Age",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lowerAge",
          label: "Lower Age",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "upperAge",
          label: "Upper Age",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "inBand", label: "In Band", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = usCensusEnumerationAgeBandLabelTool.execute;
export default usCensusEnumerationAgeBandLabelTool;
