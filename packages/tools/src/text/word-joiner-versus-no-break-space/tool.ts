import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalar: number };
export type Output = {
  readonly kind: string;
  readonly visibleSpace: boolean;
  readonly preventsBreak: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalar: { type: "integer" } },
  required: ["scalar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    visibleSpace: { type: "boolean" },
    preventsBreak: { type: "boolean" },
  },
  required: ["kind", "visibleSpace", "preventsBreak"],
} as const;
/** Calculate word joiner versus no break space from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scalar } = request;
  const compute = (): Output => {
    H.codePoint(scalar);
    return {
      kind:
        scalar === 8288
          ? "word-joiner"
          : scalar === 160
            ? "no-break-space"
            : "other",
      visibleSpace: scalar === 160,
      preventsBreak: scalar === 8288 || scalar === 160,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scalar: 8288 },
  output: { kind: "word-joiner", visibleSpace: false, preventsBreak: true },
} satisfies ToolExample<Input, Output>;
export const wordJoinerVersusNoBreakSpaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/word-joiner-versus-no-break-space",
    title: "Word Joiner Versus No Break Space Tool",
    description:
      "Calculate word joiner versus no break space from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scalar: { type: "integer" } },
      required: ["scalar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", maxLength: 8192 },
        visibleSpace: { type: "boolean" },
        preventsBreak: { type: "boolean" },
      },
      required: ["kind", "visibleSpace", "preventsBreak"],
    },
    ports: {
      inputs: [
        {
          id: "scalar",
          label: "Scalar",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "kind", label: "Kind", valueType: { type: "string" } },
        {
          id: "visibleSpace",
          label: "Visible Space",
          valueType: { type: "boolean" },
        },
        {
          id: "preventsBreak",
          label: "Prevents Break",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = wordJoinerVersusNoBreakSpaceTool.execute;
export default wordJoinerVersusNoBreakSpaceTool;
