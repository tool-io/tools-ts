import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly uriReference: string };
export type Output = {
  readonly state: string;
  readonly fragment: string;
  readonly delimiterIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uriReference: { type: "string", maxLength: 8192 } },
  required: ["uriReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "string", maxLength: 8192 },
    fragment: { type: "string", maxLength: 8192 },
    delimiterIndex: { type: "integer" },
  },
  required: ["state", "fragment", "delimiterIndex"],
} as const;
/** Distinguish absent, empty and nonempty literal URI fragment components without percent decoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uriReference } = request;
  const compute = (): Output => {
    const delimiterIndex = uriReference.indexOf("#");
    const fragment =
      delimiterIndex < 0 ? "" : uriReference.slice(delimiterIndex + 1);
    return {
      state:
        delimiterIndex < 0
          ? "absent"
          : fragment.length === 0
            ? "empty"
            : "nonempty",
      fragment,
      delimiterIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uriReference: "page#" },
  output: { state: "empty", fragment: "", delimiterIndex: 4 },
} satisfies ToolExample<Input, Output>;
export const uriFragmentEmptyStateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/uri-fragment-empty-state",
    title: "URI Fragment Empty State Tool",
    description:
      "Distinguish absent, empty and nonempty literal URI fragment components without percent decoding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uriReference: { type: "string", maxLength: 8192 } },
      required: ["uriReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "string", maxLength: 8192 },
        fragment: { type: "string", maxLength: 8192 },
        delimiterIndex: { type: "integer" },
      },
      required: ["state", "fragment", "delimiterIndex"],
    },
    ports: {
      inputs: [
        {
          id: "uriReference",
          label: "Uri Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "state", label: "State", valueType: { type: "string" } },
        { id: "fragment", label: "Fragment", valueType: { type: "string" } },
        {
          id: "delimiterIndex",
          label: "Delimiter Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = uriFragmentEmptyStateTool.execute;
export default uriFragmentEmptyStateTool;
