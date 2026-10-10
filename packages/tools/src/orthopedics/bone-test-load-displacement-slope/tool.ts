import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLoadNewtons: number;
  readonly secondLoadNewtons: number;
  readonly firstDisplacementMillimeters: number;
  readonly secondDisplacementMillimeters: number;
};
export type Output = { readonly secantNewtonsPerMillimeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLoadNewtons: { type: "number" },
    secondLoadNewtons: { type: "number" },
    firstDisplacementMillimeters: { type: "number" },
    secondDisplacementMillimeters: { type: "number" },
  },
  required: [
    "firstLoadNewtons",
    "secondLoadNewtons",
    "firstDisplacementMillimeters",
    "secondDisplacementMillimeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secantNewtonsPerMillimeter: { type: "number" } },
  required: ["secantNewtonsPerMillimeter"],
} as const;
/** Return a signed secant load/displacement slope between explicit bench-test points without inferring bone strength or material modulus. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstLoadNewtons,
    secondLoadNewtons,
    firstDisplacementMillimeters,
    secondDisplacementMillimeters,
  } = request;
  const compute = (): Output => {
    H.domain(
      secondDisplacementMillimeters !== firstDisplacementMillimeters,
      "secondDisplacementMillimeters",
    );
    return {
      secantNewtonsPerMillimeter:
        (secondLoadNewtons - firstLoadNewtons) /
        (secondDisplacementMillimeters - firstDisplacementMillimeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLoadNewtons: 100,
    secondLoadNewtons: 300,
    firstDisplacementMillimeters: 1,
    secondDisplacementMillimeters: 3,
  },
  output: { secantNewtonsPerMillimeter: 100 },
} satisfies ToolExample<Input, Output>;
export const boneTestLoadDisplacementSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthopedics", "health and medicine"],
      keywords: ["orthopedics", "health and medicine"],
    },
    id: "orthopedics/bone-test-load-displacement-slope",
    title: "Bone Test Load Displacement Slope",
    description:
      "Return a signed secant load/displacement slope between explicit bench-test points without inferring bone strength or material modulus.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLoadNewtons: { type: "number" },
        secondLoadNewtons: { type: "number" },
        firstDisplacementMillimeters: { type: "number" },
        secondDisplacementMillimeters: { type: "number" },
      },
      required: [
        "firstLoadNewtons",
        "secondLoadNewtons",
        "firstDisplacementMillimeters",
        "secondDisplacementMillimeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { secantNewtonsPerMillimeter: { type: "number" } },
      required: ["secantNewtonsPerMillimeter"],
    },
    ports: {
      inputs: [
        {
          id: "firstLoadNewtons",
          label: "First Load Newtons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLoadNewtons",
          label: "Second Load Newtons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDisplacementMillimeters",
          label: "First Displacement Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDisplacementMillimeters",
          label: "Second Displacement Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "secantNewtonsPerMillimeter",
          label: "Secant Newtons Per Millimeter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boneTestLoadDisplacementSlopeTool.execute;
export default boneTestLoadDisplacementSlopeTool;
