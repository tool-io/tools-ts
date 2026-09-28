import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectIds: readonly string[];
  readonly visitTimes: readonly number[];
  readonly selectedObject: string;
  readonly referenceInterval: number;
};
export type Output = {
  readonly visitCount: number;
  readonly shortestGap: number;
  readonly longestGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    visitTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    selectedObject: { type: "string", maxLength: 8192 },
    referenceInterval: { type: "number", minimum: 0 },
  },
  required: ["objectIds", "visitTimes", "selectedObject", "referenceInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitCount: { type: "integer" },
    shortestGap: { type: "number" },
    longestGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["visitCount", "shortestGap", "longestGap", "defined"],
} as const;
/** Calculate cover object visit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectIds, visitTimes, selectedObject, referenceInterval } = request;
  const compute = (): Output => {
    H.sameLength(objectIds, visitTimes);
    H.domain(referenceInterval >= 0);
    return (() => {
      const t = visitTimes
          .filter((x, i) => objectIds[i] === selectedObject)
          .sort((a, b) => a - b),
        g = t.slice(1).map((x, i) => x - t[i] - referenceInterval);
      return {
        visitCount: t.length,
        shortestGap: g.length ? Math.min(...g) : 0,
        longestGap: g.length ? Math.max(...g) : 0,
        defined: g.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectIds: ["A", "B", "A", "A"],
    visitTimes: [0, 1, 5, 8],
    selectedObject: "A",
    referenceInterval: 4,
  },
  output: { visitCount: 3, shortestGap: -1, longestGap: 1, defined: true },
} satisfies ToolExample<Input, Output>;
export const coverObjectVisitGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "herpetology/cover-object-visit-gap",
      title: "Cover Object Visit Gap Tool",
      description:
        "Calculate cover object visit gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          visitTimes: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          selectedObject: { type: "string", maxLength: 8192 },
          referenceInterval: { type: "number", minimum: 0 },
        },
        required: [
          "objectIds",
          "visitTimes",
          "selectedObject",
          "referenceInterval",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          visitCount: { type: "integer" },
          shortestGap: { type: "number" },
          longestGap: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["visitCount", "shortestGap", "longestGap", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "objectIds",
            label: "Object Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "visitTimes",
            label: "Visit Times",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "selectedObject",
            label: "Selected Object",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceInterval",
            label: "Reference Interval",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "visitCount",
            label: "Visit Count",
            valueType: { type: "integer" },
          },
          {
            id: "shortestGap",
            label: "Shortest Gap",
            valueType: { type: "number" },
          },
          {
            id: "longestGap",
            label: "Longest Gap",
            valueType: { type: "number" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = coverObjectVisitGapTool.execute;
export default coverObjectVisitGapTool;
