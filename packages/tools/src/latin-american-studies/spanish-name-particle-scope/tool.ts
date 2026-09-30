import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly particleStart: number;
  readonly particleEnd: number;
};
export type Output = {
  readonly particle: readonly string[];
  readonly remainder: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    particleStart: { type: "integer", minimum: 0 },
    particleEnd: { type: "integer" },
  },
  required: ["tokens", "particleStart", "particleEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    particle: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    remainder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["particle", "remainder"],
} as const;
/** Separate a caller-annotated half-open name-particle span without inferring identity or surname structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, particleStart, particleEnd } = request;
  const compute = (): Output => {
    H.integer(particleStart, 0, tokens.length);
    H.integer(particleEnd, particleStart, tokens.length);
    return {
      particle: tokens.slice(particleStart, particleEnd),
      remainder: tokens.filter((_, i) => i < particleStart || i >= particleEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokens: ["de", "la", "Cruz"], particleStart: 0, particleEnd: 2 },
  output: { particle: ["de", "la"], remainder: ["Cruz"] },
} satisfies ToolExample<Input, Output>;
export const spanishNameParticleScopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/spanish-name-particle-scope",
    title: "Spanish Name Particle Scope Tool",
    description:
      "Separate a caller-annotated half-open name-particle span without inferring identity or surname structure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        particleStart: { type: "integer", minimum: 0 },
        particleEnd: { type: "integer" },
      },
      required: ["tokens", "particleStart", "particleEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        particle: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        remainder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["particle", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "particleStart",
          label: "Particle Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "particleEnd",
          label: "Particle End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "particle",
          label: "Particle",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "remainder",
          label: "Remainder",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = spanishNameParticleScopeTool.execute;
export default spanishNameParticleScopeTool;
