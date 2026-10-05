import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly volume: number; readonly issue: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "integer", minimum: 1 },
    issue: { type: "integer", minimum: 1 },
  },
  required: ["volume", "issue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly numbered serial volume and issue fields without inferring publication frequency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, issue } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(volume) &&
        volume >= 1 &&
        volume <= Number.MAX_SAFE_INTEGER,
      "volume",
    ),
      volume);
    (H.domain(
      Number.isSafeInteger(issue) &&
        issue >= 1 &&
        issue <= Number.MAX_SAFE_INTEGER,
      "issue",
    ),
      issue);
    return { label: "vol. " + volume + ", no. " + issue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 12, issue: 3 },
  output: { label: "vol. 12, no. 3" },
} satisfies ToolExample<Input, Output>;
export const serialEnumerationVolumeIssueLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/serial-enumeration-volume-issue-label",
    title: "Serial Enumeration Volume Issue Label Tool",
    description:
      "Format explicitly numbered serial volume and issue fields without inferring publication frequency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "integer", minimum: 1 },
        issue: { type: "integer", minimum: 1 },
      },
      required: ["volume", "issue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issue",
          label: "Issue",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = serialEnumerationVolumeIssueLabelTool.execute;
export default serialEnumerationVolumeIssueLabelTool;
