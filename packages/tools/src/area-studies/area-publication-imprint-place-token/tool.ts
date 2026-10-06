import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly imprintPlace: string;
  readonly imprintYear: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    imprintPlace: { type: "string", maxLength: 8192, minLength: 1 },
    imprintYear: { type: "integer", minimum: -100000, maximum: 9999 },
  },
  required: ["publicationId", "imprintPlace", "imprintYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode explicitly transcribed publication imprint place and year without geocoding or resolving a publisher. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, imprintPlace, imprintYear } = request;
  const compute = (): Output => {
    H.domain(
      publicationId.length > 0 && imprintPlace.length > 0,
      "publicationId",
    );
    (H.domain(
      Number.isSafeInteger(imprintYear) &&
        imprintYear >= -100000 &&
        imprintYear <= 9999,
      "imprintYear",
    ),
      imprintYear);
    return {
      token: JSON.stringify([publicationId, imprintPlace, imprintYear]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { publicationId: "P17", imprintPlace: "Accra", imprintYear: 2020 },
  output: { token: '["P17","Accra",2020]' },
} satisfies ToolExample<Input, Output>;
export const areaPublicationImprintPlaceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/area-publication-imprint-place-token",
    title: "Area Publication Imprint Place Token",
    description:
      "Encode explicitly transcribed publication imprint place and year without geocoding or resolving a publisher.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationId: { type: "string", maxLength: 8192, minLength: 1 },
        imprintPlace: { type: "string", maxLength: 8192, minLength: 1 },
        imprintYear: { type: "integer", minimum: -100000, maximum: 9999 },
      },
      required: ["publicationId", "imprintPlace", "imprintYear"],
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
          id: "publicationId",
          label: "Publication Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "imprintPlace",
          label: "Imprint Place",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "imprintYear",
          label: "Imprint Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = areaPublicationImprintPlaceTokenTool.execute;
export default areaPublicationImprintPlaceTokenTool;
