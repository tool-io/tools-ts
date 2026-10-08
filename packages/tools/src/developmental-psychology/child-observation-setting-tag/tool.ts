import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationCode: string;
  readonly setting: string;
  readonly source: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationCode: { type: "string", maxLength: 8192, minLength: 1 },
    setting: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationCode", "setting", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach an explicit setting and source to an observation record without interpreting behavior or environment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationCode, setting, source } = request;
  const compute = (): Output => {
    H.domain(
      observationCode.length > 0 && setting.length > 0 && source.length > 0,
      "observationCode",
    );
    return { tag: observationCode + " [" + setting + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationCode: "O17", setting: "classroom", source: "visit log" },
  output: { tag: "O17 [classroom; visit log]" },
} satisfies ToolExample<Input, Output>;
export const childObservationSettingTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/child-observation-setting-tag",
    title: "Child Observation Setting Tag",
    description:
      "Attach an explicit setting and source to an observation record without interpreting behavior or environment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationCode: { type: "string", maxLength: 8192, minLength: 1 },
        setting: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationCode", "setting", "source"],
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
          id: "observationCode",
          label: "Observation Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "setting",
          label: "Setting",
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
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childObservationSettingTagTool.execute;
export default childObservationSettingTagTool;
