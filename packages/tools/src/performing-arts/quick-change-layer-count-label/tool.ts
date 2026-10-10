import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly changeId: string;
  readonly removedLayers: number;
  readonly addedLayers: number;
};
export type Output = { readonly handledLayers: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changeId: { type: "string", maxLength: 8192, minLength: 1 },
    removedLayers: { type: "integer", minimum: 0 },
    addedLayers: { type: "integer", minimum: 0 },
  },
  required: ["changeId", "removedLayers", "addedLayers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    handledLayers: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["handledLayers", "label"],
} as const;
/** Label explicit quick-change layer counts without estimating change difficulty or required duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { changeId, removedLayers, addedLayers } = request;
  const compute = (): Output => {
    H.domain(changeId.length > 0, "changeId");
    (H.domain(
      Number.isSafeInteger(removedLayers) &&
        removedLayers >= 0 &&
        removedLayers <= Number.MAX_SAFE_INTEGER,
      "removedLayers",
    ),
      removedLayers);
    (H.domain(
      Number.isSafeInteger(addedLayers) &&
        addedLayers >= 0 &&
        addedLayers <= Number.MAX_SAFE_INTEGER,
      "addedLayers",
    ),
      addedLayers);
    return {
      handledLayers: Number(BigInt(removedLayers) + BigInt(addedLayers)),
      label: changeId + "; remove=" + removedLayers + "; add=" + addedLayers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { changeId: "CH17", removedLayers: 2, addedLayers: 3 },
  output: { handledLayers: 5, label: "CH17; remove=2; add=3" },
} satisfies ToolExample<Input, Output>;
export const quickChangeLayerCountLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/quick-change-layer-count-label",
    title: "Quick Change Layer Count Label",
    description:
      "Label explicit quick-change layer counts without estimating change difficulty or required duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changeId: { type: "string", maxLength: 8192, minLength: 1 },
        removedLayers: { type: "integer", minimum: 0 },
        addedLayers: { type: "integer", minimum: 0 },
      },
      required: ["changeId", "removedLayers", "addedLayers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        handledLayers: { type: "integer" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["handledLayers", "label"],
    },
    ports: {
      inputs: [
        {
          id: "changeId",
          label: "Change Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "removedLayers",
          label: "Removed Layers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "addedLayers",
          label: "Added Layers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "handledLayers",
          label: "Handled Layers",
          valueType: { type: "integer" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = quickChangeLayerCountLabelTool.execute;
export default quickChangeLayerCountLabelTool;
