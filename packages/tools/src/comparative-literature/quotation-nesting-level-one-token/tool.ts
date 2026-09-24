import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depth: number;
  readonly token: string;
  readonly opening: string;
  readonly closing: string;
};
export type Output = { readonly nextDepth: number; readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer", minimum: 0 },
    token: { type: "string", maxLength: 8192 },
    opening: { type: "string", maxLength: 8192 },
    closing: { type: "string", maxLength: 8192 },
  },
  required: ["depth", "token", "opening", "closing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextDepth: { type: "integer" },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["nextDepth", "kind"],
} as const;
/** Update one nesting level from explicit distinct opening and closing tokens; this is not a full quotation parser. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, token, opening, closing } = request;
  const compute = (): Output => {
    H.integer(depth, 0);
    H.domain(opening !== closing && opening.length > 0 && closing.length > 0);
    const kind =
      token === opening ? "open" : token === closing ? "close" : "other";
    H.domain(kind !== "close" || depth > 0);
    return {
      nextDepth: depth + (kind === "open" ? 1 : kind === "close" ? -1 : 0),
      kind,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 1, token: "“", opening: "“", closing: "”" },
  output: { nextDepth: 2, kind: "open" },
} satisfies ToolExample<Input, Output>;
export const quotationNestingLevelOneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/quotation-nesting-level-one-token",
    title: "Quotation Nesting Level One Token Tool",
    description:
      "Update one nesting level from explicit distinct opening and closing tokens; this is not a full quotation parser.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer", minimum: 0 },
        token: { type: "string", maxLength: 8192 },
        opening: { type: "string", maxLength: 8192 },
        closing: { type: "string", maxLength: 8192 },
      },
      required: ["depth", "token", "opening", "closing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextDepth: { type: "integer" },
        kind: { type: "string", maxLength: 8192 },
      },
      required: ["nextDepth", "kind"],
    },
    ports: {
      inputs: [
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "closing",
          label: "Closing",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nextDepth",
          label: "Next Depth",
          valueType: { type: "integer" },
        },
        { id: "kind", label: "Kind", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = quotationNestingLevelOneTokenTool.execute;
export default quotationNestingLevelOneTokenTool;
