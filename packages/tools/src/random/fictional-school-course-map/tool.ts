import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";
import { SimpleToolError } from "../../core/simple.js";
export type FictionalSchoolCourseMapInput = w.WSeed & {
  readonly courses: readonly {
    readonly id: string;
    readonly prerequisiteOptions: readonly (readonly string[])[];
  }[];
};
export type FictionalSchoolCourseMapOutput = w.WMeta & {
  readonly courses: readonly {
    readonly id: string;
    readonly prerequisites: readonly string[];
    readonly level: number;
  }[];
  readonly order: readonly string[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  courses: w.wArray(
    w.wObject({
      id: w.wId,
      prerequisiteOptions: w.wArray(w.wArray(w.wId, 4), 4, 1),
    }),
    16,
    1,
  ),
});
export const outputSchema = w.wOutput({
  courses: w.wArray(
    w.wObject({
      id: w.wId,
      prerequisites: w.wArray(w.wId, 4),
      level: w.wInt(0, 15),
    }),
    16,
    1,
  ),
  order: w.wIds,
  componentCount: w.wInt(1, 16),
});
const isInput = (v: unknown): v is FictionalSchoolCourseMapInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalSchoolCourseMap = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalSchoolCourseMapOutput, keyof w.WMeta> => {
      const ids = x.courses.map((c) => c.id);
      w.wUnique(ids, "courses");
      for (const c of x.courses) {
        for (const option of c.prerequisiteOptions) {
          w.wRefs(option, ids, "courses");
        }
        w.wUnique(
          c.prerequisiteOptions.map((o) => [...o].sort().join("|")),
          "courses",
        );
      }
      const chosen: (readonly string[])[] = [],
        tick = w.wBudget();
      let order: readonly string[] = [];
      const edges = (): w.WLink[] =>
        chosen.flatMap((pre, i) => pre.map((from) => ({ from, to: ids[i] })));
      const solve = (i: number): boolean => {
        tick();
        if (i === ids.length) {
          try {
            order = calculateTopologicalSort({
              graph: w.wGraph(ids, edges(), true),
            }).order;
            return true;
          } catch (error) {
            if (
              error instanceof SimpleToolError &&
              error.code === "cyclic_graph"
            )
              return false;
            throw error;
          }
        }
        for (const option of random.shuffle(x.courses[i].prerequisiteOptions)) {
          chosen.push(option);
          if (solve(i + 1)) return true;
          chosen.pop();
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      const levels = new Map<string, number>();
      for (const id of order) {
        const i = ids.indexOf(id);
        levels.set(
          id,
          chosen[i].reduce(
            (max, pre) => Math.max(max, (levels.get(pre) ?? 0) + 1),
            0,
          ),
        );
      }
      return {
        courses: ids.map((id, i) => ({
          id,
          prerequisites: [...chosen[i]],
          level: levels.get(id) ?? 0,
        })),
        order,
        componentCount: w.wComponents(ids, edges()),
      };
    },
  );
export const fictionalSchoolCourseMapExample = {
  input: {
    courses: [
      {
        id: "basics",
        prerequisiteOptions: [[]],
      },
      {
        id: "runes",
        prerequisiteOptions: [["basics"]],
      },
      {
        id: "gates",
        prerequisiteOptions: [["runes"], ["basics"]],
      },
    ],
    seed: 42,
  },
  output: {
    courses: [
      {
        id: "basics",
        prerequisites: [],
        level: 0,
      },
      {
        id: "runes",
        prerequisites: ["basics"],
        level: 1,
      },
      {
        id: "gates",
        prerequisites: ["runes"],
        level: 2,
      },
    ],
    order: ["basics", "runes", "gates"],
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalSchoolCourseMapInput,
  FictionalSchoolCourseMapOutput
>;
export const fictionalSchoolCourseMapTool = createModelDefinition<
  FictionalSchoolCourseMapInput,
  FictionalSchoolCourseMapOutput
>({
  id: "random/fictional-school-course-map",
  title: "Random Fictional School Course Map Generator",
  description:
    "Choose supplied prerequisite alternatives for fictional courses with bounded nonuniform DAG search and retained curriculum levels; no accreditation claims.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalSchoolCourseMap,
});
export const runFictionalSchoolCourseMap = fictionalSchoolCourseMapTool.execute;
export default fictionalSchoolCourseMapTool;
