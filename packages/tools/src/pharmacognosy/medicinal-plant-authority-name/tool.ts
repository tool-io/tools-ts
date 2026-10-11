import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly scientificName: string;
  readonly suppliedAuthority: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    scientificName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAuthority: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "scientificName", "suppliedAuthority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied botanical name and authority without authenticating taxonomy or medicinal identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, scientificName, suppliedAuthority } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(scientificName.length > 0, "scientificName");
    H.domain(suppliedAuthority.length > 0, "suppliedAuthority");
    return {
      token: JSON.stringify([recordId, scientificName, suppliedAuthority]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "P17",
    scientificName: "Genus species",
    suppliedAuthority: "Author A",
  },
  output: { token: '["P17","Genus species","Author A"]' },
} satisfies ToolExample<Input, Output>;
export const medicinalplantAuthorityNameTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/medicinal-plant-authority-name",
    title: "Medicinal Plant Authority Name",
    description:
      "Preserve an explicitly supplied botanical name and authority without authenticating taxonomy or medicinal identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        scientificName: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAuthority: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "scientificName", "suppliedAuthority"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scientificName",
          label: "Scientific Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAuthority",
          label: "Supplied Authority",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = medicinalplantAuthorityNameTool.execute;
export default medicinalplantAuthorityNameTool;
