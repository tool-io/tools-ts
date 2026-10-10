import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateText: string;
  readonly boundaryConvention: string;
  readonly conventionSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    boundaryConvention: { type: "string", maxLength: 8192, minLength: 1 },
    conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["dateText", "boundaryConvention", "conventionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record explicit Islamic-date text and its stated day-boundary convention without calendar conversion or assigning a religious practice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, boundaryConvention, conventionSource } = request;
  const compute = (): Output => {
    H.domain(
      dateText.length > 0 &&
        boundaryConvention.length > 0 &&
        conventionSource.length > 0,
      "dateText",
    );
    return {
      label: JSON.stringify([dateText, boundaryConvention, conventionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dateText: "1448-01-01",
    boundaryConvention: "sunset",
    conventionSource: "Calendar A",
  },
  output: { label: '["1448-01-01","sunset","Calendar A"]' },
} satisfies ToolExample<Input, Output>;
export const islamicDateDayBoundaryConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/islamic-date-day-boundary-convention",
    title: "Islamic Date Day Boundary Convention",
    description:
      "Record explicit Islamic-date text and its stated day-boundary convention without calendar conversion or assigning a religious practice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        boundaryConvention: { type: "string", maxLength: 8192, minLength: 1 },
        conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["dateText", "boundaryConvention", "conventionSource"],
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
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundaryConvention",
          label: "Boundary Convention",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conventionSource",
          label: "Convention Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = islamicDateDayBoundaryConventionTool.execute;
export default islamicDateDayBoundaryConventionTool;
