import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reported: number;
  readonly limit: number;
  readonly comparator: string;
};
export type Output = {
  readonly lowerPresent: boolean;
  readonly upperPresent: boolean;
  readonly bound: number;
  readonly inclusive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "number", minimum: 0 },
    limit: { type: "number", minimum: 0 },
    comparator: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">=", "="],
    },
  },
  required: ["reported", "limit", "comparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerPresent: { type: "boolean" },
    upperPresent: { type: "boolean" },
    bound: { type: "number" },
    inclusive: { type: "boolean" },
  },
  required: ["lowerPresent", "upperPresent", "bound", "inclusive"],
} as const;
/** Interpret an explicitly supplied concentration censor token without imputing a value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, limit, comparator } = request;
  const compute = (): Output => {
    H.domain(["<", "<=", ">", ">=", "="].includes(comparator), "comparator");
    H.domain(reported >= 0 && limit >= 0);
    return {
      lowerPresent:
        comparator === ">" || comparator === ">=" || comparator === "=",
      upperPresent:
        comparator === "<" || comparator === "<=" || comparator === "=",
      bound: comparator === "=" ? reported : limit,
      inclusive: comparator === "=" || comparator.includes("="),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reported: 0, limit: 2, comparator: "<" },
  output: {
    lowerPresent: false,
    upperPresent: true,
    bound: 2,
    inclusive: false,
  },
} satisfies ToolExample<Input, Output>;
export const pkResearchCensoredConcentrationIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-research-censored-concentration-interval",
      title: "PK Research Censored Concentration Interval Tool",
      description:
        "Interpret an explicitly supplied concentration censor token without imputing a value.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reported: { type: "number", minimum: 0 },
          limit: { type: "number", minimum: 0 },
          comparator: {
            type: "string",
            maxLength: 8192,
            enum: ["<", "<=", ">", ">=", "="],
          },
        },
        required: ["reported", "limit", "comparator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerPresent: { type: "boolean" },
          upperPresent: { type: "boolean" },
          bound: { type: "number" },
          inclusive: { type: "boolean" },
        },
        required: ["lowerPresent", "upperPresent", "bound", "inclusive"],
      },
      ports: {
        inputs: [
          {
            id: "reported",
            label: "Reported",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "limit",
            label: "Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "comparator",
            label: "Comparator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lowerPresent",
            label: "Lower Present",
            valueType: { type: "boolean" },
          },
          {
            id: "upperPresent",
            label: "Upper Present",
            valueType: { type: "boolean" },
          },
          { id: "bound", label: "Bound", valueType: { type: "number" } },
          {
            id: "inclusive",
            label: "Inclusive",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pkResearchCensoredConcentrationIntervalTool.execute;
export default pkResearchCensoredConcentrationIntervalTool;
