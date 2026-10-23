import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  parseLimitedArguments,
  readValidationLimits,
} from "./validation-limits.mjs";

test("limits require a command and bounded integer settings", () => {
  assert.deepEqual(parseLimitedArguments(["--", "node", "--version"]), {
    memoryMiB: 4096,
    seconds: 1800,
    command: ["node", "--version"],
  });
  assert.equal(
    parseLimitedArguments(["--time-seconds", "7200", "--", "node"]).seconds,
    7200,
  );
  for (const args of [
    [],
    ["--"],
    ["--memory-mib", "max", "--", "node"],
    ["--memory-mib", "6145", "--", "node"],
    ["--time-seconds", "0", "--", "node"],
    ["--time-seconds", "7201", "--", "node"],
    ["--unknown", "1", "--", "node"],
  ])
    assert.throws(() => parseLimitedArguments(args));
});

test("a command cannot start without an enforced RAM, zero-swap and task boundary", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "toolio-validation-limits-"));
  try {
    const procFile = path.join(root, "membership");
    const group = path.join(root, "unit");
    await mkdir(group);
    await writeFile(procFile, "0::/unit\n");
    const check = () =>
      readValidationLimits({ memoryMiB: 128, procFile, cgroupRoot: root });
    const configure = async (memory, swap, tasks) => {
      await writeFile(path.join(group, "memory.max"), memory);
      await writeFile(path.join(group, "memory.swap.max"), swap);
      await writeFile(path.join(group, "pids.max"), tasks);
    };
    for (const values of [
      ["max", "0", "256"],
      ["268435456", "0", "256"],
      ["134217728", "max", "256"],
      ["134217728", "1", "256"],
      ["134217728", "0", "max"],
      ["134217728", "0", "257"],
    ]) {
      await configure(...values);
      await assert.rejects(check);
    }
    await configure("134217728", "0", "256");
    assert.deepEqual(await check(), {
      directory: group,
      memoryMaxBytes: 134217728,
      swapMaxBytes: 0,
      tasksMax: 256,
    });
    await writeFile(procFile, "0::/../escape\n");
    await assert.rejects(check);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
