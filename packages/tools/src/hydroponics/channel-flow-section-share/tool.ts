import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wettedArea: number;
  readonly fullSectionArea: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wettedArea: { type: "number", minimum: 0 },
    fullSectionArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wettedArea", "fullSectionArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate channel flow section share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wettedArea, fullSectionArea } = request;
  const compute = (): Output => {
    H.positive(fullSectionArea);
    H.domain(wettedArea >= 0 && wettedArea <= fullSectionArea);
    return { share: wettedArea / fullSectionArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wettedArea: 3, fullSectionArea: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const channelFlowSectionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/channel-flow-section-share",
    title: "Channel Flow Section Share Tool",
    description:
      "Calculate channel flow section share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wettedArea: { type: "number", minimum: 0 },
        fullSectionArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wettedArea", "fullSectionArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "wettedArea",
          label: "Wetted Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullSectionArea",
          label: "Full Section Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = channelFlowSectionShareTool.execute;
export default channelFlowSectionShareTool;
