# ink-ml-notes

Handwritten notes on ML/DL & math fundamentals, organized by topic modules for high-frequency review.

> 手写整理的机器学习 / 深度学习核心知识点与数学基础速查库。按 **专题模块化** 划分，不严格绑定学科边界。

---

## Topics 专题索引

Append-only. New topics get the next free `TNN` slot; do not renumber existing entries.
编号只增不改，旧链接永不失效。

### Math 数学基础

| ID  | Topic                         | Keywords                            | Status   |
| --- | ----------------------------- | ----------------------------------- | -------- |
| T01 | [SVD / PCA / LDA](./topics/T01-svd-pca-lda/)            | dim reduction · eigen · projection  | 🧪 Draft |
| T02 | [Matrix Calculus 矩阵求导](./topics/T02-matrix-calculus/) | layout · chain rule · Jacobian      | 🧪 Draft |
| T03 | [KKT & Duality 对偶问题](./topics/T03-kkt-duality/)      | convex · Lagrangian · slackness     | 🧪 Draft |

### Deep Learning 深度学习

| ID  | Topic                         | Keywords                            | Status   |
| --- | ----------------------------- | ----------------------------------- | -------- |
| T04 | [DL Optimizers 优化器](./topics/T04-dl-optimizers/)      | SGD · Momentum · Adam · Lion        | 🧪 Draft |

**Status legend** — 🧪 Draft (占号未写) · 🚧 WIP (持续补充) · ✅ Done (已封板，建议生成 `topic.pdf`)

## Layout 目录约定

```
topics/
└── TNN-slug/
    ├── 01.png      # zero-padded, append-only
    └── 02.png
```

- **No per-topic README**：专题信息（关键词、状态）统一在本 README 维护，避免重复。
- **PNG-first**: native images render inline on GitHub, single-page edits are friction-free.
- **PDF optional**: 某专题封板后，可在该目录追加 `topic.pdf` 作为离线副本。

## Conventions 编辑约定

- File naming: `NN.png` (zero-padded two digits)
- New topic = new `TNN-` folder + 在上方索引表追加一行，never renumber existing ones
- Large PNGs tracked via **Git LFS** (see `.gitattributes`)
- Commit messages: `T03: add KKT slackness page` / `T01: refine SVD geometry diagram`

## License

Content licensed under [CC BY-NC-SA 4.0](./LICENSE) — non-commercial use with attribution, share-alike.
