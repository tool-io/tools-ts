import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly sourceNames: readonly string[];
  readonly targetNames: readonly string[];
  readonly sourceEdition: string;
  readonly targetEdition: string;
};
export type Output = { readonly target: string; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    sourceNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceEdition: { type: "string", maxLength: 8192 },
    targetEdition: { type: "string", maxLength: 8192 },
  },
  required: [
    "name",
    "sourceNames",
    "targetNames",
    "sourceEdition",
    "targetEdition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    target: { type: "string", maxLength: 8192 },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["target", "sourceKey"],
} as const;
/** Cross-reference supplied historical point-name labels without location or procedure inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, sourceNames, targetNames, sourceEdition, targetEdition } =
    request;
  const compute = (): Output => {
    H.sameLength(sourceNames, targetNames);
    H.domain(new Set(sourceNames).size === sourceNames.length, "sourceNames");
    const index = sourceNames.indexOf(name);
    H.domain(index >= 0, "name");
    return {
      target: targetNames[index],
      sourceKey: JSON.stringify([sourceEdition, targetEdition, name]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    name: "A1",
    sourceNames: ["A1", "B2"],
    targetNames: ["X", "Y"],
    sourceEdition: "source-v1",
    targetEdition: "target-v2",
  },
  output: { target: "X", sourceKey: '["source-v1","target-v2","A1"]' },
} satisfies ToolExample<Input, Output>;
export const acupunctureDocumentPointnameSourceCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-document-pointname-source-crosswalk",
      title: "Acupuncture Document Pointname Source Crosswalk Tool",
      description:
        "Cross-reference supplied historical point-name labels without location or procedure inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", maxLength: 8192 },
          sourceNames: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          targetNames: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          sourceEdition: { type: "string", maxLength: 8192 },
          targetEdition: { type: "string", maxLength: 8192 },
        },
        required: [
          "name",
          "sourceNames",
          "targetNames",
          "sourceEdition",
          "targetEdition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          target: { type: "string", maxLength: 8192 },
          sourceKey: { type: "string", maxLength: 8192 },
        },
        required: ["target", "sourceKey"],
      },
      ports: {
        inputs: [
          {
            id: "name",
            label: "Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceNames",
            label: "Source Names",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "targetNames",
            label: "Target Names",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "sourceEdition",
            label: "Source Edition",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "targetEdition",
            label: "Target Edition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "target", label: "Target", valueType: { type: "string" } },
          {
            id: "sourceKey",
            label: "Source Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureDocumentPointnameSourceCrosswalkTool.execute;
export default acupunctureDocumentPointnameSourceCrosswalkTool;
