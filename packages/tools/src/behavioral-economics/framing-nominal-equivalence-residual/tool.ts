import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFrameAmount: number;
  readonly secondFrameAmount: number;
  readonly suppliedSecondToFirstFactor: number;
};
export type Output = { readonly residualInFirstUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFrameAmount: { type: "number" },
    secondFrameAmount: { type: "number" },
    suppliedSecondToFirstFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstFrameAmount",
    "secondFrameAmount",
    "suppliedSecondToFirstFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residualInFirstUnits: { type: "number" } },
  required: ["residualInFirstUnits"],
} as const;
/** Compare two explicit framed quantities after applying a supplied positive conversion to a common basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFrameAmount, secondFrameAmount, suppliedSecondToFirstFactor } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedSecondToFirstFactor) &&
        suppliedSecondToFirstFactor > 0,
      "suppliedSecondToFirstFactor",
    ),
      suppliedSecondToFirstFactor);
    return {
      residualInFirstUnits:
        secondFrameAmount * suppliedSecondToFirstFactor - firstFrameAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstFrameAmount: 100,
    secondFrameAmount: 50,
    suppliedSecondToFirstFactor: 2,
  },
  output: { residualInFirstUnits: 0 },
} satisfies ToolExample<Input, Output>;
export const framingNominalEquivalenceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/framing-nominal-equivalence-residual",
    title: "Framing Nominal Equivalence Residual",
    description:
      "Compare two explicit framed quantities after applying a supplied positive conversion to a common basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFrameAmount: { type: "number" },
        secondFrameAmount: { type: "number" },
        suppliedSecondToFirstFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstFrameAmount",
        "secondFrameAmount",
        "suppliedSecondToFirstFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residualInFirstUnits: { type: "number" } },
      required: ["residualInFirstUnits"],
    },
    ports: {
      inputs: [
        {
          id: "firstFrameAmount",
          label: "First Frame Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFrameAmount",
          label: "Second Frame Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSecondToFirstFactor",
          label: "Supplied Second To First Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualInFirstUnits",
          label: "Residual In First Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = framingNominalEquivalenceResidualTool.execute;
export default framingNominalEquivalenceResidualTool;
