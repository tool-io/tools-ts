import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedArea: number;
  readonly suppliedTailArea: number;
  readonly includeTail: boolean;
  readonly referenceArea: number;
};
export type Output = {
  readonly reportedArea: number;
  readonly tailShare: number;
  readonly referenceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedArea: { type: "number", minimum: 0 },
    suppliedTailArea: { type: "number", minimum: 0 },
    includeTail: { type: "boolean" },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "observedArea",
    "suppliedTailArea",
    "includeTail",
    "referenceArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedArea: { type: "number" },
    tailShare: { type: "number" },
    referenceRatio: { type: "number" },
  },
  required: ["reportedArea", "tailShare", "referenceRatio"],
} as const;
/** Compare already supplied research exposure areas; no tail extrapolation model or dose adjustment is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedArea, suppliedTailArea, includeTail, referenceArea } =
    request;
  const compute = (): Output => {
    H.domain(observedArea >= 0 && suppliedTailArea >= 0);
    H.positive(referenceArea);
    return {
      reportedArea: observedArea + (includeTail ? suppliedTailArea : 0),
      tailShare:
        observedArea + suppliedTailArea > 0
          ? suppliedTailArea / (observedArea + suppliedTailArea)
          : 0,
      referenceRatio:
        (observedArea + (includeTail ? suppliedTailArea : 0)) / referenceArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedArea: 80,
    suppliedTailArea: 20,
    includeTail: true,
    referenceArea: 50,
  },
  output: { reportedArea: 100, tailShare: 0.2, referenceRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const pkCensoredTailReferenceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-censored-tail-reference-base",
    title: "PK Censored Tail Reference Base Tool",
    description:
      "Compare already supplied research exposure areas; no tail extrapolation model or dose adjustment is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedArea: { type: "number", minimum: 0 },
        suppliedTailArea: { type: "number", minimum: 0 },
        includeTail: { type: "boolean" },
        referenceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "observedArea",
        "suppliedTailArea",
        "includeTail",
        "referenceArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedArea: { type: "number" },
        tailShare: { type: "number" },
        referenceRatio: { type: "number" },
      },
      required: ["reportedArea", "tailShare", "referenceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "observedArea",
          label: "Observed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTailArea",
          label: "Supplied Tail Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeTail",
          label: "Include Tail",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reportedArea",
          label: "Reported Area",
          valueType: { type: "number" },
        },
        { id: "tailShare", label: "Tail Share", valueType: { type: "number" } },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkCensoredTailReferenceBaseTool.execute;
export default pkCensoredTailReferenceBaseTool;
