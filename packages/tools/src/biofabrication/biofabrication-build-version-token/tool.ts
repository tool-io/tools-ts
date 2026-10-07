import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly buildId: string;
  readonly designId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    buildId: { type: "string", maxLength: 8192, minLength: 1 },
    designId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["buildId", "designId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit fabrication build-design reference by version without producing fabrication instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { buildId, designId, version } = request;
  const compute = (): Output => {
    H.domain(buildId.length > 0, "buildId");
    H.domain(designId.length > 0, "designId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([buildId, designId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { buildId: "BUILD17", designId: "DES2", version: "v2" },
  output: { token: '["BUILD17","DES2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const biofabricationBuildVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/biofabrication-build-version-token",
    title: "Biofabrication Build Version Token",
    description:
      "Qualify an explicit fabrication build-design reference by version without producing fabrication instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        buildId: { type: "string", maxLength: 8192, minLength: 1 },
        designId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["buildId", "designId", "version"],
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
          id: "buildId",
          label: "Build Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "designId",
          label: "Design Id",
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
export const run = biofabricationBuildVersionTokenTool.execute;
export default biofabricationBuildVersionTokenTool;
