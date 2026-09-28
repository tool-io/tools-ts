import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly suppliedLabels: readonly string[];
};
export type Output = { readonly recognized: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    suppliedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["label", "suppliedLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, index: { type: "integer" } },
  required: ["recognized", "index"],
} as const;
/** Match opaque supplied specimen-site labels without anatomical inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, suppliedLabels } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedLabels).size === suppliedLabels.length);
    return {
      recognized: suppliedLabels.includes(label),
      index: suppliedLabels.indexOf(label),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "A", suppliedLabels: ["A", "B"] },
  output: { recognized: true, index: 0 },
} satisfies ToolExample<Input, Output>;
export const specimenSiteLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/specimen-site-label-token",
    title: "Specimen Site Label Token Tool",
    description:
      "Match opaque supplied specimen-site labels without anatomical inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        suppliedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["label", "suppliedLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        index: { type: "integer" },
      },
      required: ["recognized", "index"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedLabels",
          label: "Supplied Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = specimenSiteLabelTokenTool.execute;
export default specimenSiteLabelTokenTool;
