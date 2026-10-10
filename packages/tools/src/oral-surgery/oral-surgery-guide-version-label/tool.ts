import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly guideId: string;
  readonly version: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guideId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["guideId", "version", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit oral-surgery guide identifier and version without assessing a guide or treatment plan. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { guideId, version, source } = request;
  const compute = (): Output => {
    H.domain(guideId.length > 0, "guideId");
    H.domain(version.length > 0, "version");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([guideId, version, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { guideId: "G17", version: "v2", source: "Recorded guide A" },
  output: { token: '["G17","v2","Recorded guide A"]' },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryGuideVersionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-surgery-guide-version-label",
    title: "Oral Surgery Guide Version Label",
    description:
      "Record an explicit oral-surgery guide identifier and version without assessing a guide or treatment plan.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guideId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["guideId", "version", "source"],
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
          id: "guideId",
          label: "Guide Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralSurgeryGuideVersionLabelTool.execute;
export default oralSurgeryGuideVersionLabelTool;
