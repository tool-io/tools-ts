import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly names: readonly string[];
  readonly pathLengths: readonly number[];
  readonly creationOrders: readonly number[];
  readonly requestedName: string;
};
export type Output = { readonly selectedIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    names: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pathLengths: { type: "array", maxItems: 256, items: { type: "integer" } },
    creationOrders: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    requestedName: { type: "string", maxLength: 8192 },
  },
  required: ["names", "pathLengths", "creationOrders", "requestedName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selectedIndex: { type: "integer" } },
  required: ["selectedIndex"],
} as const;
/** Order eligible same-name cookies by longer supplied path then earlier creation; request applicability is supplied, not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { names, pathLengths, creationOrders, requestedName } = request;
  const compute = (): Output => {
    H.sameLength(names, pathLengths);
    H.sameLength(names, creationOrders);
    H.domain(
      pathLengths.every((x) => x >= 0) &&
        creationOrders.every((x) => x >= 0) &&
        new Set(creationOrders).size === creationOrders.length,
    );
    const ids = names
      .flatMap((x, i) => (x === requestedName ? [i] : []))
      .sort(
        (a, b) =>
          pathLengths[b] - pathLengths[a] ||
          creationOrders[a] - creationOrders[b],
      );
    return { selectedIndex: ids[0] ?? -1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    names: ["id", "id", "other"],
    pathLengths: [1, 4, 8],
    creationOrders: [0, 1, 2],
    requestedName: "id",
  },
  output: { selectedIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const httpCookieDuplicatePathTieTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-cookie-duplicate-path-tie-token",
    title: "HTTP Cookie Duplicate Path Tie Token Tool",
    description:
      "Order eligible same-name cookies by longer supplied path then earlier creation; request applicability is supplied, not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        names: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        pathLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        creationOrders: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        requestedName: { type: "string", maxLength: 8192 },
      },
      required: ["names", "pathLengths", "creationOrders", "requestedName"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { selectedIndex: { type: "integer" } },
      required: ["selectedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "names",
          label: "Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "pathLengths",
          label: "Path Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "creationOrders",
          label: "Creation Orders",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "requestedName",
          label: "Requested Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "selectedIndex",
          label: "Selected Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpCookieDuplicatePathTieTokenTool.execute;
export default httpCookieDuplicatePathTieTokenTool;
