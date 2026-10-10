import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly regionLabel: string;
  readonly versionSuffix: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    regionLabel: { type: "string", maxLength: 8192, minLength: 1 },
    versionSuffix: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "regionLabel", "versionSuffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit media edition by supplied region and version without determining territorial availability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, regionLabel, versionSuffix } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(regionLabel.length > 0, "regionLabel");
    H.domain(versionSuffix.length > 0, "versionSuffix");
    return { token: JSON.stringify([workId, regionLabel, versionSuffix]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workId: "W17", regionLabel: "Region A", versionSuffix: "v2" },
  output: { token: '["W17","Region A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const mediaEditionRegionalVersionSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/media-edition-regional-version-suffix",
    title: "Media Edition Regional Version Suffix",
    description:
      "Qualify an explicit media edition by supplied region and version without determining territorial availability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workId: { type: "string", maxLength: 8192, minLength: 1 },
        regionLabel: { type: "string", maxLength: 8192, minLength: 1 },
        versionSuffix: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["workId", "regionLabel", "versionSuffix"],
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
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regionLabel",
          label: "Region Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versionSuffix",
          label: "Version Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = mediaEditionRegionalVersionSuffixTool.execute;
export default mediaEditionRegionalVersionSuffixTool;
