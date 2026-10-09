import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shedSkinId: string;
  readonly parentAnimalId: string;
  readonly attributionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shedSkinId: { type: "string", maxLength: 8192, minLength: 1 },
    parentAnimalId: { type: "string", maxLength: 8192, minLength: 1 },
    attributionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["shedSkinId", "parentAnimalId", "attributionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly attributed shed-skin parent specimen without inferring identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shedSkinId, parentAnimalId, attributionSource } = request;
  const compute = (): Output => {
    H.domain(shedSkinId.length > 0, "shedSkinId");
    H.domain(parentAnimalId.length > 0, "parentAnimalId");
    H.domain(attributionSource.length > 0, "attributionSource");
    return {
      token: JSON.stringify([shedSkinId, parentAnimalId, attributionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shedSkinId: "SK17",
    parentAnimalId: "A3",
    attributionSource: "Keeper log",
  },
  output: { token: '["SK17","A3","Keeper log"]' },
} satisfies ToolExample<Input, Output>;
export const shedskinSpecimenParentTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["herpetology", "biology"],
      keywords: ["herpetology", "biology"],
    },
    id: "herpetology/shed-skin-specimen-parent-tag",
    title: "Shed Skin Specimen Parent Tag",
    description:
      "Record an explicitly attributed shed-skin parent specimen without inferring identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shedSkinId: { type: "string", maxLength: 8192, minLength: 1 },
        parentAnimalId: { type: "string", maxLength: 8192, minLength: 1 },
        attributionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["shedSkinId", "parentAnimalId", "attributionSource"],
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
          id: "shedSkinId",
          label: "Shed Skin Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentAnimalId",
          label: "Parent Animal Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "attributionSource",
          label: "Attribution Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = shedskinSpecimenParentTagTool.execute;
export default shedskinSpecimenParentTagTool;
