import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeMass: number;
  readonly afterMass: number;
  readonly cleanedResidue: number;
  readonly initialSurfaceArea: number;
};
export type Output = {
  readonly grossLoss: number;
  readonly netLoss: number;
  readonly lossPerArea: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMass: { type: "number", exclusiveMinimum: 0 },
    afterMass: { type: "number", minimum: 0 },
    cleanedResidue: { type: "number", minimum: 0 },
    initialSurfaceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["beforeMass", "afterMass", "cleanedResidue", "initialSurfaceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLoss: { type: "number" },
    netLoss: { type: "number" },
    lossPerArea: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["grossLoss", "netLoss", "lossPerArea", "fraction"],
} as const;
/** Separate measured polishing loss from supplied removable residue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMass, afterMass, cleanedResidue, initialSurfaceArea } = request;
  const compute = (): Output => {
    H.positive(beforeMass);
    H.positive(initialSurfaceArea);
    H.domain(afterMass >= 0 && cleanedResidue >= 0);
    return {
      grossLoss: beforeMass - afterMass,
      netLoss: beforeMass - afterMass - cleanedResidue,
      lossPerArea:
        (beforeMass - afterMass - cleanedResidue) / initialSurfaceArea,
      fraction: (beforeMass - afterMass - cleanedResidue) / beforeMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeMass: 100,
    afterMass: 97,
    cleanedResidue: 1,
    initialSurfaceArea: 20,
  },
  output: { grossLoss: 3, netLoss: 2, lossPerArea: 0.1, fraction: 0.02 },
} satisfies ToolExample<Input, Output>;
export const prosthesisPolishMassLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthesis-polish-mass-loss-term",
    title: "Prosthesis Polish Mass Loss Term Tool",
    description:
      "Separate measured polishing loss from supplied removable residue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeMass: { type: "number", exclusiveMinimum: 0 },
        afterMass: { type: "number", minimum: 0 },
        cleanedResidue: { type: "number", minimum: 0 },
        initialSurfaceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "beforeMass",
        "afterMass",
        "cleanedResidue",
        "initialSurfaceArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossLoss: { type: "number" },
        netLoss: { type: "number" },
        lossPerArea: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["grossLoss", "netLoss", "lossPerArea", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "beforeMass",
          label: "Before Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterMass",
          label: "After Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cleanedResidue",
          label: "Cleaned Residue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialSurfaceArea",
          label: "Initial Surface Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossLoss", label: "Gross Loss", valueType: { type: "number" } },
        { id: "netLoss", label: "Net Loss", valueType: { type: "number" } },
        {
          id: "lossPerArea",
          label: "Loss Per Area",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = prosthesisPolishMassLossTermTool.execute;
export default prosthesisPolishMassLossTermTool;
