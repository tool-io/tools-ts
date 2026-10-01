import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly firstZ: number;
  readonly secondX: number;
  readonly secondY: number;
  readonly secondZ: number;
  readonly suppliedScale: number;
};
export type Output = { readonly spacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    firstZ: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
    secondZ: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstX",
    "firstY",
    "firstZ",
    "secondX",
    "secondY",
    "secondZ",
    "suppliedScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spacing: { type: "number" } },
  required: ["spacing"],
} as const;
/** Measure supplied bench-model landmark spacing without arch diagnosis or treatment planning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, firstZ, secondX, secondY, secondZ, suppliedScale } =
    request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      spacing:
        Math.hypot(secondX - firstX, secondY - firstY, secondZ - firstZ) *
        suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstX: 0,
    firstY: 0,
    firstZ: 0,
    secondX: 2,
    secondY: 3,
    secondZ: 6,
    suppliedScale: 1,
  },
  output: { spacing: 7 },
} satisfies ToolExample<Input, Output>;
export const dentalArchPointSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/dental-arch-point-spacing",
    title: "Dental Arch Point Spacing Tool",
    description:
      "Measure supplied bench-model landmark spacing without arch diagnosis or treatment planning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        firstZ: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
        secondZ: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstX",
        "firstY",
        "firstZ",
        "secondX",
        "secondY",
        "secondZ",
        "suppliedScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spacing: { type: "number" } },
      required: ["spacing"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstZ",
          label: "First Z",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondZ",
          label: "Second Z",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "spacing", label: "Spacing", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dentalArchPointSpacingTool.execute;
export default dentalArchPointSpacingTool;
