import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOrigin: readonly number[];
  readonly firstDirection: readonly number[];
  readonly secondOrigin: readonly number[];
  readonly secondDirection: readonly number[];
};
export type Output = {
  readonly firstParameter: number;
  readonly secondParameter: number;
  readonly point: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOrigin: { type: "array", maxItems: 256, items: { type: "number" } },
    firstDirection: { type: "array", maxItems: 256, items: { type: "number" } },
    secondOrigin: { type: "array", maxItems: 256, items: { type: "number" } },
    secondDirection: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: [
    "firstOrigin",
    "firstDirection",
    "secondOrigin",
    "secondDirection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstParameter: { type: "number" },
    secondParameter: { type: "number" },
    point: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["firstParameter", "secondParameter", "point"],
} as const;
/** Intersect two infinite planar perspective lines; signed parameters expose intersections behind either origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOrigin, firstDirection, secondOrigin, secondDirection } =
    request;
  const compute = (): Output => {
    H.domain(
      [firstOrigin, firstDirection, secondOrigin, secondDirection].every(
        (v) => v.length === 2,
      ),
    );
    const cross = (a: readonly number[], b: readonly number[]) =>
        a[0] * b[1] - a[1] * b[0],
      denominator = cross(firstDirection, secondDirection);
    H.domain(denominator !== 0);
    const delta = secondOrigin.map((x, i) => x - firstOrigin[i]),
      firstParameter = cross(delta, secondDirection) / denominator,
      secondParameter = cross(delta, firstDirection) / denominator;
    return {
      firstParameter,
      secondParameter,
      point: firstOrigin.map((x, i) => x + firstParameter * firstDirection[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOrigin: [0, 0],
    firstDirection: [1, 1],
    secondOrigin: [2, 0],
    secondDirection: [-1, 1],
  },
  output: { firstParameter: 1, secondParameter: 1, point: [1, 1] },
} satisfies ToolExample<Input, Output>;
export const perspectiveVanishingRayIntersectionParameterTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "visual-arts/perspective-vanishing-ray-intersection-parameter",
      title: "Perspective Vanishing Ray Intersection Parameter Tool",
      description:
        "Intersect two infinite planar perspective lines; signed parameters expose intersections behind either origin.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstOrigin: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          firstDirection: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          secondOrigin: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          secondDirection: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: [
          "firstOrigin",
          "firstDirection",
          "secondOrigin",
          "secondDirection",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstParameter: { type: "number" },
          secondParameter: { type: "number" },
          point: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["firstParameter", "secondParameter", "point"],
      },
      ports: {
        inputs: [
          {
            id: "firstOrigin",
            label: "First Origin",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "firstDirection",
            label: "First Direction",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "secondOrigin",
            label: "Second Origin",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "secondDirection",
            label: "Second Direction",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "firstParameter",
            label: "First Parameter",
            valueType: { type: "number" },
          },
          {
            id: "secondParameter",
            label: "Second Parameter",
            valueType: { type: "number" },
          },
          {
            id: "point",
            label: "Point",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = perspectiveVanishingRayIntersectionParameterTool.execute;
export default perspectiveVanishingRayIntersectionParameterTool;
