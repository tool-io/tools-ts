import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceName: string;
  readonly fillingSolution: string;
  readonly temperatureCelsius: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceName: { type: "string", maxLength: 8192, minLength: 1 },
    fillingSolution: { type: "string", maxLength: 8192, minLength: 1 },
    temperatureCelsius: { type: "number", exclusiveMinimum: -273.15 },
  },
  required: ["referenceName", "fillingSolution", "temperatureCelsius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Label an explicitly described reference electrode, filling solution and temperature without supplying a reference-potential conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceName, fillingSolution, temperatureCelsius } = request;
  const compute = (): Output => {
    H.domain(
      referenceName.length > 0 &&
        fillingSolution.length > 0 &&
        temperatureCelsius > -273.15,
      "referenceName",
    );
    return {
      token:
        referenceName +
        " [" +
        fillingSolution +
        "; " +
        temperatureCelsius +
        " °C]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceName: "Ag/AgCl",
    fillingSolution: "3 M KCl",
    temperatureCelsius: 25,
  },
  output: { token: "Ag/AgCl [3 M KCl; 25 °C]" },
} satisfies ToolExample<Input, Output>;
export const electrodeReferenceNameTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/electrode-reference-name-token",
    title: "Electrode Reference Name Token",
    description:
      "Label an explicitly described reference electrode, filling solution and temperature without supplying a reference-potential conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceName: { type: "string", maxLength: 8192, minLength: 1 },
        fillingSolution: { type: "string", maxLength: 8192, minLength: 1 },
        temperatureCelsius: { type: "number", exclusiveMinimum: -273.15 },
      },
      required: ["referenceName", "fillingSolution", "temperatureCelsius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "referenceName",
          label: "Reference Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fillingSolution",
          label: "Filling Solution",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "temperatureCelsius",
          label: "Temperature Celsius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = electrodeReferenceNameTokenTool.execute;
export default electrodeReferenceNameTokenTool;
