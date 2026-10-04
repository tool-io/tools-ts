import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly opening: string;
  readonly closing: string;
  readonly depth: number;
  readonly symmetricRole: string;
};
export type Output = { readonly role: string; readonly nextDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    opening: { type: "string", maxLength: 8192 },
    closing: { type: "string", maxLength: 8192 },
    depth: { type: "integer", minimum: 0 },
    symmetricRole: { type: "string", maxLength: 8192, enum: ["open", "close"] },
  },
  required: ["token", "opening", "closing", "depth", "symmetricRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: { type: "string", maxLength: 8192 },
    nextDepth: { type: "integer" },
  },
  required: ["role", "nextDepth"],
} as const;
/** Apply explicit quote-token roles and a supplied symmetric-quote policy without guessing linguistic nesting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, opening, closing, depth, symmetricRole } = request;
  const compute = (): Output => {
    H.integer(depth, 0);
    H.domain(
      opening.length > 0 &&
        closing.length > 0 &&
        ["open", "close"].includes(symmetricRole),
    );
    const role =
      token === opening && token === closing
        ? symmetricRole
        : token === opening
          ? "open"
          : token === closing
            ? "close"
            : "other";
    H.domain(role !== "close" || depth > 0);
    return {
      role,
      nextDepth: depth + (role === "open" ? 1 : role === "close" ? -1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "“",
    opening: "“",
    closing: "”",
    depth: 0,
    symmetricRole: "open",
  },
  output: { role: "open", nextDepth: 1 },
} satisfies ToolExample<Input, Output>;
export const quotationMarkNestingRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/quotation-mark-nesting-role",
    title: "Quotation Mark Nesting Role Tool",
    description:
      "Apply explicit quote-token roles and a supplied symmetric-quote policy without guessing linguistic nesting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        opening: { type: "string", maxLength: 8192 },
        closing: { type: "string", maxLength: 8192 },
        depth: { type: "integer", minimum: 0 },
        symmetricRole: {
          type: "string",
          maxLength: 8192,
          enum: ["open", "close"],
        },
      },
      required: ["token", "opening", "closing", "depth", "symmetricRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxLength: 8192 },
        nextDepth: { type: "integer" },
      },
      required: ["role", "nextDepth"],
    },
    ports: {
      inputs: [
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
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "symmetricRole",
          label: "Symmetric Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "role", label: "Role", valueType: { type: "string" } },
        {
          id: "nextDepth",
          label: "Next Depth",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotationMarkNestingRoleTool.execute;
export default quotationMarkNestingRoleTool;
