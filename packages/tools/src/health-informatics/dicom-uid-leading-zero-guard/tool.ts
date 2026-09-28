import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly uid: string };
export type Output = {
  readonly leadingZeroComponents: readonly number[];
  readonly withinLengthLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uid: { type: "string", maxLength: 8192 } },
  required: ["uid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingZeroComponents: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    withinLengthLimit: { type: "boolean" },
  },
  required: ["leadingZeroComponents", "withinLengthLimit"],
} as const;
/** Inspect numeric UID component spelling and the 64-character limit; does not assign, resolve or authenticate a DICOM UID. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uid } = request;
  const compute = (): Output => {
    H.domain(/^\d+(?:\.\d+)*(?![\s\S])/.test(uid), "uid");
    const components = uid.split(".");
    return {
      leadingZeroComponents: components.flatMap((x, i) =>
        x.length > 1 && x.startsWith("0") ? [i] : [],
      ),
      withinLengthLimit: uid.length <= 64,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uid: "1.02.003" },
  output: { leadingZeroComponents: [1, 2], withinLengthLimit: true },
} satisfies ToolExample<Input, Output>;
export const dicomUidLeadingZeroGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/dicom-uid-leading-zero-guard",
    title: "DICOM UID Leading Zero Guard Tool",
    description:
      "Inspect numeric UID component spelling and the 64-character limit; does not assign, resolve or authenticate a DICOM UID.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uid: { type: "string", maxLength: 8192 } },
      required: ["uid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingZeroComponents: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        withinLengthLimit: { type: "boolean" },
      },
      required: ["leadingZeroComponents", "withinLengthLimit"],
    },
    ports: {
      inputs: [
        {
          id: "uid",
          label: "Uid",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "leadingZeroComponents",
          label: "Leading Zero Components",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "withinLengthLimit",
          label: "Within Length Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomUidLeadingZeroGuardTool.execute;
export default dicomUidLeadingZeroGuardTool;
