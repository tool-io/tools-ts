import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStep: number;
  readonly firstSuppliedBase: number;
  readonly secondStep: number;
  readonly secondSuppliedBase: number;
};
export type Output = {
  readonly firstLogDilution: number;
  readonly secondLogDilution: number;
  readonly logGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStep: { type: "integer", minimum: 0 },
    firstSuppliedBase: { type: "number", exclusiveMinimum: 1 },
    secondStep: { type: "integer", minimum: 0 },
    secondSuppliedBase: { type: "number", exclusiveMinimum: 1 },
  },
  required: [
    "firstStep",
    "firstSuppliedBase",
    "secondStep",
    "secondSuppliedBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLogDilution: { type: "number" },
    secondLogDilution: { type: "number" },
    logGap: { type: "number" },
  },
  required: ["firstLogDilution", "secondLogDilution", "logGap"],
} as const;
/** Compare formal dilution notation using explicit bases; this arithmetic makes no efficacy or material-content claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStep, firstSuppliedBase, secondStep, secondSuppliedBase } =
    request;
  const compute = (): Output => {
    H.integer(firstStep, 0);
    H.integer(secondStep, 0);
    H.domain(firstSuppliedBase > 1 && secondSuppliedBase > 1);
    return (() => {
      const firstLogDilution = firstStep * Math.log10(firstSuppliedBase),
        secondLogDilution = secondStep * Math.log10(secondSuppliedBase);
      return {
        firstLogDilution,
        secondLogDilution,
        logGap: secondLogDilution - firstLogDilution,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStep: 3,
    firstSuppliedBase: 10,
    secondStep: 2,
    secondSuppliedBase: 100,
  },
  output: { firstLogDilution: 3, secondLogDilution: 4, logGap: 1 },
} satisfies ToolExample<Input, Output>;
export const formalNotationBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/formal-notation-basis-gap",
    title: "Formal Notation Basis Gap Tool",
    description:
      "Compare formal dilution notation using explicit bases; this arithmetic makes no efficacy or material-content claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStep: { type: "integer", minimum: 0 },
        firstSuppliedBase: { type: "number", exclusiveMinimum: 1 },
        secondStep: { type: "integer", minimum: 0 },
        secondSuppliedBase: { type: "number", exclusiveMinimum: 1 },
      },
      required: [
        "firstStep",
        "firstSuppliedBase",
        "secondStep",
        "secondSuppliedBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLogDilution: { type: "number" },
        secondLogDilution: { type: "number" },
        logGap: { type: "number" },
      },
      required: ["firstLogDilution", "secondLogDilution", "logGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstStep",
          label: "First Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstSuppliedBase",
          label: "First Supplied Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStep",
          label: "Second Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSuppliedBase",
          label: "Second Supplied Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstLogDilution",
          label: "First Log Dilution",
          valueType: { type: "number" },
        },
        {
          id: "secondLogDilution",
          label: "Second Log Dilution",
          valueType: { type: "number" },
        },
        { id: "logGap", label: "Log Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = formalNotationBasisGapTool.execute;
export default formalNotationBasisGapTool;
