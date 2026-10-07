import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly traitValue: number;
  readonly multiplier: number;
  readonly offset: number;
};
export type Output = { readonly standardizedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    traitValue: { type: "number" },
    multiplier: { type: "number" },
    offset: { type: "number" },
  },
  required: ["traitValue", "multiplier", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardizedValue: { type: "number" } },
  required: ["standardizedValue"],
} as const;
/** Apply an explicitly supplied affine trait-unit conversion, preserving signed values without identifying the biological trait. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { traitValue, multiplier, offset } = request;
  const compute = (): Output => {
    H.domain(multiplier !== 0, "multiplier");
    return { standardizedValue: traitValue * multiplier + offset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { traitValue: 12, multiplier: 0.01, offset: 0 },
  output: { standardizedValue: 0.12 },
} satisfies ToolExample<Input, Output>;
export const traitUnitStandardizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/trait-unit-standardization",
    title: "Trait Unit Standardization",
    description:
      "Apply an explicitly supplied affine trait-unit conversion, preserving signed values without identifying the biological trait.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        traitValue: { type: "number" },
        multiplier: { type: "number" },
        offset: { type: "number" },
      },
      required: ["traitValue", "multiplier", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { standardizedValue: { type: "number" } },
      required: ["standardizedValue"],
    },
    ports: {
      inputs: [
        {
          id: "traitValue",
          label: "Trait Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "standardizedValue",
          label: "Standardized Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = traitUnitStandardizationTool.execute;
export default traitUnitStandardizationTool;
