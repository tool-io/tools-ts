import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly position: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    position: {
      type: "string",
      maxLength: 8192,
      enum: ["recumbent", "standing", "other", "unspecified"],
    },
  },
  required: ["measurementId", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach an explicit measurement-position label without converting recumbent length to standing height. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, position } = request;
  const compute = (): Output => {
    H.domain(measurementId.length > 0, "measurementId");
    H.domain(
      ["recumbent", "standing", "other", "unspecified"].includes(position),
      "position",
    );
    return { tag: measurementId + " [" + position + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measurementId: "M17", position: "recumbent" },
  output: { tag: "M17 [recumbent]" },
} satisfies ToolExample<Input, Output>;
export const childMeasurementRecumbentStandingTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["pediatrics", "health and medicine"],
        keywords: ["pediatrics", "health and medicine"],
      },
      id: "pediatrics/child-measurement-recumbent-standing-tag",
      title: "Child Measurement Recumbent Standing Tag",
      description:
        "Attach an explicit measurement-position label without converting recumbent length to standing height.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measurementId: { type: "string", maxLength: 8192, minLength: 1 },
          position: {
            type: "string",
            maxLength: 8192,
            enum: ["recumbent", "standing", "other", "unspecified"],
          },
        },
        required: ["measurementId", "position"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tag: { type: "string", maxLength: 8192 } },
        required: ["tag"],
      },
      ports: {
        inputs: [
          {
            id: "measurementId",
            label: "Measurement Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = childMeasurementRecumbentStandingTagTool.execute;
export default childMeasurementRecumbentStandingTagTool;
