import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly position: number;
  readonly lower: number;
  readonly upper: number;
  readonly equalityPolicy: string;
};
export type Output = { readonly membership: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    equalityPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["inside", "outside"],
    },
  },
  required: ["position", "lower", "upper", "equalityPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { membership: { type: "string", maxLength: 8192 } },
  required: ["membership"],
} as const;
/** Classify a supplied coordinate under explicit domain-edge equality semantics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position, lower, upper, equalityPolicy } = request;
  const compute = (): Output => {
    H.domain(upper >= lower && ["inside", "outside"].includes(equalityPolicy));
    return {
      membership:
        position > lower && position < upper
          ? "inside"
          : position === lower || position === upper
            ? equalityPolicy
            : "outside",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: 1, lower: 0, upper: 1, equalityPolicy: "outside" },
  output: { membership: "outside" },
} satisfies ToolExample<Input, Output>;
export const morphogenDomainEdgeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/morphogen-domain-edge-token",
    title: "Morphogen Domain Edge Token Tool",
    description:
      "Classify a supplied coordinate under explicit domain-edge equality semantics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        equalityPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["inside", "outside"],
        },
      },
      required: ["position", "lower", "upper", "equalityPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { membership: { type: "string", maxLength: 8192 } },
      required: ["membership"],
    },
    ports: {
      inputs: [
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityPolicy",
          label: "Equality Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "membership",
          label: "Membership",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = morphogenDomainEdgeTokenTool.execute;
export default morphogenDomainEdgeTokenTool;
