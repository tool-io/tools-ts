import { runCompiler } from "./package-build.mjs";
import { runCompilerBatches } from "./compiler-batches.mjs";

const configuration = JSON.parse(
  await runCompiler(["--showConfig", "-p", "tsconfig.json"]),
);
const result = await runCompilerBatches({
  configuration,
  project: "tsconfig.json",
  noEmit: true,
});
console.log(
  `Typechecked ${result.roots} source/test roots in ${result.batches} sequential batches.`,
);
