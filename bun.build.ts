import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./build",
  format: "esm",
  plugins: [dts({ output: { exportReferencedTypes: false } })],
  external: ["zod"],
});

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./build",
  format: "cjs",
  naming: "[dir]/[name].cjs",
  external: ["zod"],
});

// Copy .d.ts to .d.cts for CommonJS TypeScript support
const dtsContent = await Bun.file("./build/index.d.ts");
await Bun.write("./build/index.d.cts", dtsContent);
