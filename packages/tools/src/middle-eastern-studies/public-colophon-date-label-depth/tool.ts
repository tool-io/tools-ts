import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateLabels: readonly string[];
  readonly suppliedOrder: readonly string[];
};
export type Output = {
  readonly recognized: number;
  readonly unrecognized: number;
  readonly hierarchyConsistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["dateLabels", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "integer" },
    unrecognized: { type: "integer" },
    hierarchyConsistent: { type: "boolean" },
  },
  required: ["recognized", "unrecognized", "hierarchyConsistent"],
} as const;
/** Inspect explicit public colophon date-component labels under a caller-supplied hierarchy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateLabels, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    return (() => {
      const positions = dateLabels.map((x) => suppliedOrder.indexOf(x));
      return {
        recognized: positions.filter((x) => x >= 0).length,
        unrecognized: positions.filter((x) => x < 0).length,
        hierarchyConsistent: positions.every(
          (x, i) => x >= 0 && (i === 0 || x > positions[i - 1]),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dateLabels: ["year", "day"],
    suppliedOrder: ["year", "month", "day"],
  },
  output: { recognized: 2, unrecognized: 0, hierarchyConsistent: true },
} satisfies ToolExample<Input, Output>;
export const publicColophonDateLabelDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/public-colophon-date-label-depth",
    title: "Public Colophon Date Label Depth Tool",
    description:
      "Inspect explicit public colophon date-component labels under a caller-supplied hierarchy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["dateLabels", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "integer" },
        unrecognized: { type: "integer" },
        hierarchyConsistent: { type: "boolean" },
      },
      required: ["recognized", "unrecognized", "hierarchyConsistent"],
    },
    ports: {
      inputs: [
        {
          id: "dateLabels",
          label: "Date Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "integer" },
        },
        {
          id: "unrecognized",
          label: "Unrecognized",
          valueType: { type: "integer" },
        },
        {
          id: "hierarchyConsistent",
          label: "Hierarchy Consistent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicColophonDateLabelDepthTool.execute;
export default publicColophonDateLabelDepthTool;
