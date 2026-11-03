# Build ImageLab — Initial Development Instructions

I want you to develop ImageLab, a fast, local-first image analysis and organization application.

Before doing anything, read the project's `AGENTS.md` carefully. It contains the permanent technical requirements, architecture principles, performance expectations and reasoning-effort policy.

## 1. Your role

Act as a senior software engineer specializing in:

- Image processing.
- Browser performance.
- Web Workers and parallel computing.
- TypeScript.
- Memory-efficient applications.
- Data structures and algorithms.
- Performance benchmarking.

Do not simply generate code as quickly as possible. Make sound engineering decisions and validate them.

I want you to be proactive, but I do not want unnecessary complexity or overengineering.

## 2. Product vision

ImageLab allows users to import thousands of images and analyze, organize, filter and sort them using automatically extracted properties.

The application must work locally in the browser. Images should not be uploaded to a server.

Potential users include:

- Photographers organizing large photo collections.
- Machine Learning engineers preparing image datasets.
- Researchers analyzing scientific images in future versions.

For now, focus on the shared image-processing foundation.

## 3. First milestone: 1,000-image benchmark

Your first objective is NOT to build the complete application.

Your first objective is to build a working image-processing engine and a reproducible benchmark that can process 1,000 JPEG and PNG images.

The engine must perform:

1. File metadata extraction.
2. EXIF extraction where available.
3. Brightness calculation.
4. Contrast calculation.
5. Saturation calculation.
6. Dominant color extraction.
7. Sharpness estimation.
8. Exact duplicate detection.
9. Perceptual duplicate detection.

The benchmark must measure the performance of each operation independently and as part of the complete pipeline.

## 4. Architecture

Start by inspecting the repository.

If no project exists yet, propose a clean architecture using:

- TypeScript.
- React.
- Vite.
- Web Workers.
- IndexedDB.
- Native browser image APIs.

Keep the analysis engine independent from the user interface.

Do not introduce Rust or WebAssembly immediately. First implement a reliable baseline using browser-native technologies.

However, structure the code so that computationally expensive modules can later be replaced by Rust/WASM implementations without rewriting the application.

## 5. Processing strategy

The engine must:

- Process images incrementally.
- Use a bounded worker pool.
- Avoid decoding all images simultaneously.
- Avoid retaining unnecessary full-resolution pixel buffers.
- Use reduced-resolution representations for suitable metrics.
- Persist results incrementally.
- Allow cancellation.
- Handle corrupted and unsupported files.
- Avoid blocking the main thread.

The application should be able to show partial results while processing continues.

## 6. Benchmark methodology

Create a reproducible test dataset or a documented procedure for generating one.

The dataset should include a variety of resolutions, file sizes and image characteristics.

Include known duplicate pairs and visually similar images so that duplicate detection can be evaluated for correctness.

Measure:

- Total processing time.
- Images per second.
- Time per operation.
- Median and p95 processing time.
- Error rate.
- Memory consumption or a clearly documented memory estimate.
- Main-thread responsiveness.

Separate cold runs from warm runs.

Do not fabricate benchmark results or claim performance improvements without measurements.

## 7. Development workflow

Follow this sequence:

### Phase 0 — Repository inspection

Inspect the repository, its dependencies and existing code.

Identify what can be reused.

Do not overwrite existing work.

### Phase 1 — Technical design

Propose:

- Directory structure.
- Data model.
- Image-processing pipeline.
- Worker architecture.
- Algorithms.
- Persistence strategy.
- Benchmark methodology.

Explain the important trade-offs briefly.

Do not start implementing a large amount of code before presenting this design.

### Phase 2 — Core engine

Implement file import, decoding, metadata extraction and the first visual metrics.

Add tests.

### Phase 3 — Duplicate detection

Implement exact and perceptual duplicate detection.

Validate against known examples.

### Phase 4 — Processing orchestration

Implement the worker pool, bounded queue, cancellation, incremental persistence and error handling.

### Phase 5 — Benchmark

Run the 1,000-image benchmark.

Present real measurements and identify bottlenecks.

### Phase 6 — Initial interface

Once the engine works, build a minimal interface that allows users to:

- Import a collection.
- See processing progress.
- Browse image thumbnails.
- Sort by extracted metrics.
- Filter by metadata and image properties.
- Identify duplicate groups.

Do not build advanced scientific or Machine Learning features yet.

## 8. Important constraints

- Keep processing local.
- Do not introduce mandatory paid APIs.
- Do not require a backend for the core functionality.
- Keep dependencies lightweight.
- Do not optimize blindly.
- Do not sacrifice correctness for benchmark numbers.
- Do not silently ignore processing errors.
- Do not implement features outside the current milestone unless they are necessary.

## 9. What I expect from you now

Start with Phase 0.

Inspect the repository and read `AGENTS.md`.

Then give me:

1. A brief assessment of the current project.
2. Your proposed architecture.
3. The directory structure you recommend.
4. The main technical risks.
5. A concrete implementation plan divided into small milestones.

Do not implement the entire application in one response.

After presenting the plan, wait for my feedback before making major architectural changes.

Use the reasoning-effort policy in AGENTS.md. Prefer LOW for routine work, HIGH for meaningful engineering decisions and MAX only for genuinely difficult critical problems.
