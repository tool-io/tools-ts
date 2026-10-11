import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly elementText: string;
  readonly sideText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    elementText: { type: "string", maxLength: 8192, minLength: 1 },
    sideText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "elementText", "sideText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit zooarchaeological element and side transcriptions without identifying taxa or skeletal elements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, elementText, sideText } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(elementText.length > 0, "elementText");
    H.domain(sideText.length > 0, "sideText");
    return { token: JSON.stringify([specimenId, elementText, sideText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", elementText: "humerus", sideText: "left" },
  output: { token: '["S17","humerus","left"]' },
} satisfies ToolExample<Input, Output>;
export const zooarchaeologicalElementSideTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/zooarchaeological-element-side-token",
    title: "Zooarchaeological Element Side Token Tool",
    description:
      "Preserve explicit zooarchaeological element and side transcriptions without identifying taxa or skeletal elements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        elementText: { type: "string", maxLength: 8192, minLength: 1 },
        sideText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "elementText", "sideText"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elementText",
          label: "Element Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sideText",
          label: "Side Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = zooarchaeologicalElementSideTokenTool.execute;
export default zooarchaeologicalElementSideTokenTool;
