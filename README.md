# Twister

This is a small proof of concept and benchmark for implementing a mesh deformation both in Javascript and in Rust (using WebAssembly).

![Example output](https://raw.githubusercontent.com/arraypad/twister/master/example.jpg "Twisted monkey")

## Instructions

If you'd like to run this yourself you need `yarn` and `rustup` installed already.

Install dependencies:
```bash
yarn
```

Build everything into a directory named `dist`:
```bash
yarn run build
```

Run a local web server from `dist`:
```bash
yarn run serve
```
