import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentNames: readonly string[];
  readonly interceptNames: readonly string[];
  readonly excludeIntercept: boolean;
};
export type Output = {
  readonly selected: readonly string[];
  readonly excluded: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    interceptNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excludeIntercept: { type: "boolean" },
  },
  required: ["instrumentNames", "interceptNames", "excludeIntercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selected: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["selected", "excluded"],
} as const;
/** Filter explicitly identified intercept columns; no instrument relevance or exclusion restriction is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentNames, interceptNames, excludeIntercept } = request;
  const compute = (): Output => {
    return {
      selected: instrumentNames.filter(
        (x) => !excludeIntercept || !interceptNames.includes(x),
      ),
      excluded: instrumentNames.filter(
        (x) => excludeIntercept && interceptNames.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instrumentNames: ["const", "z1", "z2"],
    interceptNames: ["const"],
    excludeIntercept: true,
  },
  output: { selected: ["z1", "z2"], excluded: ["const"] },
} satisfies ToolExample<Input, Output>;
export const instrumentInterceptExclusionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/instrument-intercept-exclusion-flag",
    title: "Instrument Intercept Exclusion Flag Tool",
    description:
      "Filter explicitly identified intercept columns; no instrument relevance or exclusion restriction is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        interceptNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excludeIntercept: { type: "boolean" },
      },
      required: ["instrumentNames", "interceptNames", "excludeIntercept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selected: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excluded: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["selected", "excluded"],
    },
    ports: {
      inputs: [
        {
          id: "instrumentNames",
          label: "Instrument Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "interceptNames",
          label: "Intercept Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excludeIntercept",
          label: "Exclude Intercept",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "selected",
          label: "Selected",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = instrumentInterceptExclusionFlagTool.execute;
export default instrumentInterceptExclusionFlagTool;
