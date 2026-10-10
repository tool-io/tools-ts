import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly readingId: string;
  readonly conductivityUnit: string;
  readonly suppliedReferenceTemperatureText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readingId: { type: "string", maxLength: 8192, minLength: 1 },
    conductivityUnit: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReferenceTemperatureText: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
  },
  required: [
    "readingId",
    "conductivityUnit",
    "suppliedReferenceTemperatureText",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit conductivity unit and reference-temperature text without applying temperature compensation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { readingId, conductivityUnit, suppliedReferenceTemperatureText } =
    request;
  const compute = (): Output => {
    H.domain(readingId.length > 0, "readingId");
    H.domain(conductivityUnit.length > 0, "conductivityUnit");
    H.domain(
      suppliedReferenceTemperatureText.length > 0,
      "suppliedReferenceTemperatureText",
    );
    return {
      token: JSON.stringify([
        readingId,
        conductivityUnit,
        suppliedReferenceTemperatureText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    readingId: "R17",
    conductivityUnit: "mS/cm",
    suppliedReferenceTemperatureText: "25 C",
  },
  output: { token: '["R17","mS/cm","25 C"]' },
} satisfies ToolExample<Input, Output>;
export const hydroponicEcTemperatureReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-ec-temperature-reference",
    title: "Hydroponic EC Temperature Reference",
    description:
      "Preserve explicit conductivity unit and reference-temperature text without applying temperature compensation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readingId: { type: "string", maxLength: 8192, minLength: 1 },
        conductivityUnit: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedReferenceTemperatureText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: [
        "readingId",
        "conductivityUnit",
        "suppliedReferenceTemperatureText",
      ],
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
          id: "readingId",
          label: "Reading Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conductivityUnit",
          label: "Conductivity Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReferenceTemperatureText",
          label: "Supplied Reference Temperature Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hydroponicEcTemperatureReferenceTool.execute;
export default hydroponicEcTemperatureReferenceTool;
