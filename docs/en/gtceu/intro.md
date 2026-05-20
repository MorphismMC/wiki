# Introduction

::: tip

We assume you already have knowledge of Minecraft mod development, so in this document we will only provide a review-style introduction to these topics. If you want to learn about related content, please refer to the relevant documentation sections.

:::

## Overview

**GregTech** is a famous technology mod in Minecraft, known for its complex mechanics, factory-style production, and rich content. This mod was originally developed by GregoriusT personally, and later maintained by the GTCEu team for the 1.12.2 version. From the earliest GregTech Community Edition (GTCE) to today's **GregTech Community Edition: Unofficial** (GTCEu), the mod's internal API has undergone extensive iteration and optimization, making the development of addon mods no longer a difficult task.

This document aims to introduce developers to the many API designs and usage patterns in GTCEu, enabling them to quickly get started with GTCEu-based addon mod development. It will also cover the underlying working principles and the operation modes of some mods that GTCEu depends on, such as Modular UI 2 and CodeChickenLib (CCL).

## Conventions

This section establishes systematic conventions for notation and narrative style used throughout this documentation series. This document uses a fictional mod called `Gregica` as the main subject for development and demonstration. Developers can follow along with the content of this document to actually create a GTCEu addon mod named `Gregica`. Note that this mod exists solely as an example and is not a real released or unreleased mod.

The common class prefix for this mod is `GA`, meaning that if there is a class with the same name in an external package, such as `Material`, the corresponding functional class within the mod will be named `GAMaterial`. Another available prefix is `Gregica`, generally used in situations where the common prefix might cause confusion, such as the distinction between `GregicaAPI` and `GAAPI`.

::: details Regarding Programming Language Usage

We default to using the Java language and generally provide Kotlin code examples as well, which can be switched by clicking the tab at the top of the code block. Note that:
- We may use modern Java syntax in development examples; developers need to use an environment with [**Jabel**](https://github.com/bsideup/jabel) or [**Jvm Downgrader**](https://github.com/unimined/JvmDowngrader) for support.
- If developers wish to use Kotlin in a production environment, the [**Forgelin Continuous**](https://github.com/ChAoSUnItY/Forgelin-Continuous) mod is required.

If you wish to use other programming languages for development, please find relevant resources and build environments on your own; they are not listed here due to space constraints.

:::

## General Content

This document uses the latest GTCEu version's API for demonstration, meaning that non-release version changes are also taken into consideration. Specific content can be found in the sidebar categories. We use chapters as the basic unit of document composition, with each chapter containing 1–4 sections to cover specific content. Based on these considerations, the writing of this document has the following characteristics:

- Serves as both an introduction and usage guide for beginners, and as a reference for developers already familiar with the relevant APIs;
- Emphasizes principles and underlying implementations, but does not force developers to read related content; generally, this content is collapsed or cited within the main text;

As an introduction, it is necessary to state the prerequisite knowledge required for reading this document:

- Mastery of basic Java or Kotlin syntax, at least understanding its object-oriented features, if-else structures and other basic operations;
- Basic understanding of Minecraft 1.12.2 and Forge development knowledge, at least understanding event registration and related content;

For content exceeding these limits, we will reference relevant external materials or provide review-style introductions within the document.

## Reading Guide

The overall writing structure of this document progresses from relatively simple parts, starting with an introduction to Meta Items and their related APIs, aiming to spark developers' interest in other APIs after understanding some holistic APIs.

We adopt a distinction between **Inner Chapters** and **Outer Chapters** to present content to developers. Inner Chapters cover the common foundational framework, while Outer Chapters serve as supplements and extensions to the Inner Chapters, involving more expansive content. For example, for the Materials section, the Inner Chapters include introductions to material registration, ore prefixes, flags, and icon sets, while the Outer Chapters include introductions to the `CraftingComponent` API and `MarkerMaterial` API. These two small APIs are part of the material-related APIs but are mostly used for ore dictionary and recipe registration, thus they are placed within the scope of Outer Chapters.

When reading, Outer Chapter content can be skipped for the time being; you may skip them when appropriate and review them later when needed.
