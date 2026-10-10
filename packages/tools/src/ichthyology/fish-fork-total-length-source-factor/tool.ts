import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forkLength: number;
  readonly suppliedTotalPerForkFactor: number;
  readonly source: string;
};
export type Output = {
  readonly estimatedTotalLength: number;
  readonly sourceLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forkLength: { type: "number", minimum: 0 },
    suppliedTotalPerForkFactor: { type: "number", exclusiveMinimum: 0 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["forkLength", "suppliedTotalPerForkFactor", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedTotalLength: { type: "number" },
    sourceLabel: { type: "string", maxLength: 8192 },
  },
  required: ["estimatedTotalLength", "sourceLabel"],
} as const;
/** Apply an explicit source-specific fork-to-total-length factor without providing a species conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forkLength, suppliedTotalPerForkFactor, source } = request;
  const compute = (): Output => {
    H.domain(forkLength >= 0, "forkLength");
    (H.domain(suppliedTotalPerForkFactor > 0, "suppliedTotalPerForkFactor"),
      suppliedTotalPerForkFactor);
    H.domain(source.length > 0, "source");
    return {
      estimatedTotalLength: forkLength * suppliedTotalPerForkFactor,
      sourceLabel: source,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forkLength: 20, suppliedTotalPerForkFactor: 1.1, source: "Study A" },
  output: { estimatedTotalLength: 22, sourceLabel: "Study A" },
} satisfies ToolExample<Input, Output>;
export const fishForkTotalLengthSourceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ichthyology", "biology"],
      keywords: ["ichthyology", "biology"],
    },
    id: "ichthyology/fish-fork-total-length-source-factor",
    title: "Fish Fork Total Length Source Factor",
    description:
      "Apply an explicit source-specific fork-to-total-length factor without providing a species conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forkLength: { type: "number", minimum: 0 },
        suppliedTotalPerForkFactor: { type: "number", exclusiveMinimum: 0 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["forkLength", "suppliedTotalPerForkFactor", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedTotalLength: { type: "number" },
        sourceLabel: { type: "string", maxLength: 8192 },
      },
      required: ["estimatedTotalLength", "sourceLabel"],
    },
    ports: {
      inputs: [
        {
          id: "forkLength",
          label: "Fork Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTotalPerForkFactor",
          label: "Supplied Total Per Fork Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "estimatedTotalLength",
          label: "Estimated Total Length",
          valueType: { type: "number" },
        },
        {
          id: "sourceLabel",
          label: "Source Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishForkTotalLengthSourceFactorTool.execute;
export default fishForkTotalLengthSourceFactorTool;
