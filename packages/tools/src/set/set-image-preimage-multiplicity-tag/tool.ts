import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domain: readonly string[];
  readonly imageValues: readonly string[];
  readonly target: string;
};
export type Output = {
  readonly preimage: readonly string[];
  readonly multiplicity: number;
  readonly inImage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domain: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    imageValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    target: { type: "string", maxLength: 8192 },
  },
  required: ["domain", "imageValues", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preimage: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    multiplicity: { type: "integer" },
    inImage: { type: "boolean" },
  },
  required: ["preimage", "multiplicity", "inImage"],
} as const;
/** Preimage and multiplicity of one supplied target under a finite explicitly tabulated map. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domain, imageValues, target } = request;
  const compute = (): Output => {
    H.sameLength(domain, imageValues);
    H.domain(new Set(domain).size === domain.length);
    const preimage = domain.filter((_, i) => imageValues[i] === target);
    return {
      preimage,
      multiplicity: preimage.length,
      inImage: preimage.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { domain: ["a", "b", "c"], imageValues: ["x", "y", "x"], target: "x" },
  output: { preimage: ["a", "c"], multiplicity: 2, inImage: true },
} satisfies ToolExample<Input, Output>;
export const setImagePreimageMultiplicityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-image-preimage-multiplicity-tag",
    title: "Set Image Preimage Multiplicity Tag Tool",
    description:
      "Preimage and multiplicity of one supplied target under a finite explicitly tabulated map.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domain: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        imageValues: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        target: { type: "string", maxLength: 8192 },
      },
      required: ["domain", "imageValues", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preimage: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        multiplicity: { type: "integer" },
        inImage: { type: "boolean" },
      },
      required: ["preimage", "multiplicity", "inImage"],
    },
    ports: {
      inputs: [
        {
          id: "domain",
          label: "Domain",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "imageValues",
          label: "Image Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "preimage",
          label: "Preimage",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "multiplicity",
          label: "Multiplicity",
          valueType: { type: "integer" },
        },
        { id: "inImage", label: "In Image", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = setImagePreimageMultiplicityTagTool.execute;
export default setImagePreimageMultiplicityTagTool;
