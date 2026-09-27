import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumeToken: string;
  readonly series: string;
  readonly repository: string;
};
export type Output = {
  readonly sourceKey: string;
  readonly hasVolume: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeToken: { type: "string", maxLength: 8192 },
    series: { type: "string", maxLength: 8192 },
    repository: { type: "string", maxLength: 8192 },
  },
  required: ["volumeToken", "series", "repository"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceKey: { type: "string", maxLength: 8192 },
    hasVolume: { type: "boolean" },
  },
  required: ["sourceKey", "hasVolume"],
} as const;
/** Preserve a supplied public register volume token without interpreting numbering systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeToken, series, repository } = request;
  const compute = (): Output => {
    return {
      sourceKey: JSON.stringify([repository, series, volumeToken]),
      hasVolume: volumeToken.trim().length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeToken: "IV", series: "births", repository: "archive-A" },
  output: { sourceKey: '["archive-A","births","IV"]', hasVolume: true },
} satisfies ToolExample<Input, Output>;
export const publicRegisterVolumeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/public-register-volume-token",
    title: "Public Register Volume Token Tool",
    description:
      "Preserve a supplied public register volume token without interpreting numbering systems.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeToken: { type: "string", maxLength: 8192 },
        series: { type: "string", maxLength: 8192 },
        repository: { type: "string", maxLength: 8192 },
      },
      required: ["volumeToken", "series", "repository"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceKey: { type: "string", maxLength: 8192 },
        hasVolume: { type: "boolean" },
      },
      required: ["sourceKey", "hasVolume"],
    },
    ports: {
      inputs: [
        {
          id: "volumeToken",
          label: "Volume Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "series",
          label: "Series",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repository",
          label: "Repository",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
        {
          id: "hasVolume",
          label: "Has Volume",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicRegisterVolumeTokenTool.execute;
export default publicRegisterVolumeTokenTool;
