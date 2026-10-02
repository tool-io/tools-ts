import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactArea: number;
  readonly regionArea: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactArea: { type: "number", minimum: 0 },
    regionArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["contactArea", "regionArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate contact region area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactArea, regionArea } = request;
  const compute = (): Output => {
    H.positive(regionArea);
    H.domain(contactArea >= 0 && contactArea <= regionArea);
    return { share: contactArea / regionArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactArea: 2, regionArea: 10 },
  output: { share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const contactRegionAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/contact-region-area-share",
    title: "Contact Region Area Share Tool",
    description:
      "Calculate contact region area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactArea: { type: "number", minimum: 0 },
        regionArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["contactArea", "regionArea"],
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
          id: "contactArea",
          label: "Contact Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "regionArea",
          label: "Region Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = contactRegionAreaShareTool.execute;
export default contactRegionAreaShareTool;
