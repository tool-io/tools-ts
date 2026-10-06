import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pointCode: string;
  readonly lateralityWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointCode: { type: "string", maxLength: 8192, minLength: 1 },
    lateralityWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["pointCode", "lateralityWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied point laterality wording and source without locating or recommending a point. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointCode, lateralityWording, source } = request;
  const compute = (): Output => {
    H.domain(pointCode.length > 0, "pointCode");
    H.domain(lateralityWording.length > 0, "lateralityWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([pointCode, lateralityWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pointCode: "P17", lateralityWording: "left", source: "Record A" },
  output: { token: '["P17","left","Record A"]' },
} satisfies ToolExample<Input, Output>;
export const acupointLateralitySourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["acupuncture", "health and medicine"],
      keywords: ["acupuncture", "health and medicine"],
    },
    id: "acupuncture/acupoint-laterality-source-label",
    title: "Acupoint Laterality Source Label",
    description:
      "Record supplied point laterality wording and source without locating or recommending a point.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointCode: { type: "string", maxLength: 8192, minLength: 1 },
        lateralityWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["pointCode", "lateralityWording", "source"],
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
          id: "pointCode",
          label: "Point Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lateralityWording",
          label: "Laterality Wording",
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
export const run = acupointLateralitySourceLabelTool.execute;
export default acupointLateralitySourceLabelTool;
