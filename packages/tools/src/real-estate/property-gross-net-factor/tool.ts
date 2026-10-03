import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly exclusions: readonly number[];
  readonly includedExclusion: readonly boolean[];
};
export type Output = {
  readonly netArea: number;
  readonly netToGross: number;
  readonly excludedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", exclusiveMinimum: 0 },
    exclusions: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    includedExclusion: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["grossArea", "exclusions", "includedExclusion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netArea: { type: "number" },
    netToGross: { type: "number" },
    excludedArea: { type: "number" },
  },
  required: ["netArea", "netToGross", "excludedArea"],
} as const;
/** Apply explicit nonoverlapping area exclusions; no measurement standard or overlap geometry is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, exclusions, includedExclusion } = request;
  const compute = (): Output => {
    H.positive(grossArea);
    H.sameLength(exclusions, includedExclusion);
    H.domain(exclusions.every((x) => x >= 0));
    return (() => {
      const excludedArea = exclusions.reduce(
        (s, x, i) => s + (includedExclusion[i] ? x : 0),
        0,
      );
      H.domain(excludedArea <= grossArea);
      const netArea = grossArea - excludedArea;
      return { netArea, netToGross: netArea / grossArea, excludedArea };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossArea: 100,
    exclusions: [10, 20],
    includedExclusion: [true, false],
  },
  output: { netArea: 90, netToGross: 0.9, excludedArea: 10 },
} satisfies ToolExample<Input, Output>;
export const propertyGrossNetFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/property-gross-net-factor",
    title: "Property Gross Net Factor Tool",
    description:
      "Apply explicit nonoverlapping area exclusions; no measurement standard or overlap geometry is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", exclusiveMinimum: 0 },
        exclusions: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        includedExclusion: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["grossArea", "exclusions", "includedExclusion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netArea: { type: "number" },
        netToGross: { type: "number" },
        excludedArea: { type: "number" },
      },
      required: ["netArea", "netToGross", "excludedArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exclusions",
          label: "Exclusions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "includedExclusion",
          label: "Included Exclusion",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
        {
          id: "netToGross",
          label: "Net To Gross",
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propertyGrossNetFactorTool.execute;
export default propertyGrossNetFactorTool;
