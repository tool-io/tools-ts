import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  num,
  integer,
  object,
  label,
  strings,
  run,
  pick,
  distinct,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  point,
  trig,
  bounds,
  pointsSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type TorusArtTemplate = {
  readonly id: string;
  readonly source: string;
  readonly majorRadius: number;
  readonly minorRadius: number;
  readonly p: number;
  readonly q: number;
};
export type ParametricKnotProjectionInput = AcSeed & {
  readonly templates: readonly TorusArtTemplate[];
  readonly axes: readonly ("xy" | "xz" | "yz")[];
  readonly intervals: number;
};
export type ParametricKnotProjectionOutput = AcReplay & {
  readonly template: TorusArtTemplate;
  readonly axis: "xy" | "xz" | "yz";
  readonly samples: readonly (readonly [number, number, number])[];
  readonly points: readonly Point[];
  readonly bounds: Box;
};
const templateSchema = object({
  id: label,
  source: label,
  majorRadius: positive,
  minorRadius: positive,
  p: integer(1, 32),
  q: integer(1, 32),
});
export const inputSchema = inputObject({
  templates: array(templateSchema, 16, 1),
  axes: array({ type: "string", enum: ["xy", "xz", "yz"] }, 3, 1),
  intervals: integer(4, 127),
});
export const outputSchema = outputObject({
  template: templateSchema,
  axis: { type: "string", enum: ["xy", "xz", "yz"] },
  samples: array(array(num, 3, 3), 128, 5),
  points: pointsSchema,
  bounds: boxSchema,
});
const isInput = (v: unknown): v is ParametricKnotProjectionInput =>
  matchesModelInput(v, inputSchema);
export const calculateParametricKnotProjection = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<ParametricKnotProjectionOutput, "randomness"> => {
      distinct(
        x.templates.map((t) => t.id),
        "templates",
      );
      distinct(x.axes, "axes");
      for (const t of x.templates) {
        let a = t.p,
          b = t.q;
        while (b) {
          const r = a % b;
          a = b;
          b = r;
        }
        if (t.majorRadius <= t.minorRadius || a !== 1)
          return simpleError(
            "templates",
            "Torus radii must satisfy R>r and positive winding counts must be coprime.",
            "invalid_template",
          );
      }
      const template = pick(x.templates, random),
        axis = pick(x.axes, random);
      const samples = Array.from(
        { length: x.intervals + 1 },
        (_, i): readonly [number, number, number] => {
          const t = i === x.intervals ? 0 : i / x.intervals,
            [c, s] = trig(template.p * t),
            [u, v] = trig(template.q * t),
            r = template.majorRadius + template.minorRadius * u,
            p = point(r * c, r * s);
          return [p[0], p[1], point(0, template.minorRadius * v)[1]];
        },
      );
      const points = samples.map(([a, b, c]) =>
        axis === "xy" ? point(a, b) : axis === "xz" ? point(a, c) : point(b, c),
      );
      return {
        template: { ...template },
        axis,
        samples,
        points,
        bounds: bounds(points),
      };
    },
  );
export const parametricKnotProjectionExample = {
  input: {
    templates: [
      {
        id: "trefoil",
        source: "caller reviewed torus template",
        majorRadius: 3,
        minorRadius: 1,
        p: 2,
        q: 3,
      },
    ],
    axes: ["xy"],
    intervals: 4,
    seed: 42,
  },
  output: {
    template: {
      id: "trefoil",
      source: "caller reviewed torus template",
      majorRadius: 3,
      minorRadius: 1,
      p: 2,
      q: 3,
    },
    axis: "xy",
    samples: [
      [4, 0, 0],
      [-3, 0, -1],
      [2, 0, 0],
      [-3, 0, 1],
      [4, 0, 0],
    ],
    points: [
      [4, 0],
      [-3, 0],
      [2, 0],
      [-3, 0],
      [4, 0],
    ],
    bounds: { minX: -3, minY: 0, maxX: 4, maxY: 0, width: 7, height: 0 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ParametricKnotProjectionInput,
  ParametricKnotProjectionOutput
>;
export const parametricKnotProjectionTool = createModelDefinition<
  ParametricKnotProjectionInput,
  ParametricKnotProjectionOutput
>({
  id: "random/parametric-knot-projection",
  title: "Random Parametric Knot Projection Generator",
  description:
    "Sample caller-reviewed coprime torus-curve templates in 3D and project onto a selected coordinate plane; sparse samples do not classify topology or crossings.",
  inputSchema,
  outputSchema,
  execute: calculateParametricKnotProjection,
});
export const runParametricKnotProjection = parametricKnotProjectionTool.execute;
export default parametricKnotProjectionTool;
