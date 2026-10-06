import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly structureId: string;
  readonly terminologySource: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    structureId: { type: "string", maxLength: 8192, minLength: 1 },
    terminologySource: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["structureId", "terminologySource", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied anatomical identifier by its explicit terminology source and version. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { structureId, terminologySource, version } = request;
  const compute = (): Output => {
    H.domain(structureId.length > 0, "structureId");
    H.domain(terminologySource.length > 0, "terminologySource");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([structureId, terminologySource, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    structureId: "A17",
    terminologySource: "Terminology A",
    version: "v3",
  },
  output: { token: '["A17","Terminology A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const anatomicalStructureIdSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/anatomical-structure-id-source-key",
    title: "Anatomical Structure ID Source Key",
    description:
      "Qualify a supplied anatomical identifier by its explicit terminology source and version.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        structureId: { type: "string", maxLength: 8192, minLength: 1 },
        terminologySource: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["structureId", "terminologySource", "version"],
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
          id: "structureId",
          label: "Structure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "terminologySource",
          label: "Terminology Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = anatomicalStructureIdSourceKeyTool.execute;
export default anatomicalStructureIdSourceKeyTool;
