# ml-atlas

> A modular knowledge base of deep-learning fundamentals and mathematical prerequisites, maintained as a continuously-updated reference site.

按主题模块化的深度学习与机器学习及相关数学基础在线知识库，基于 MkDocs Material 构建，托管在 Railway，提交即自动部署。

## 在线访问

- 主站：<https://ml-atlas.up.railway.app>（部署完成后生效）

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 内容 | Markdown + KaTeX | 纯文本，AI 可直接生成 |
| 框架 | MkDocs Material 9.x | Python 构建，分组导航 + 顶部 tabs |
| 公式 | pymdownx.arithmatex + KaTeX | 轻量、渲染快 |
| 托管 | Railway (Nixpacks) | push 触发自动重建 |

## 目录规范

```
ml-atlas/
├── docs/
│   ├── index.md                 # 首页（卡片网格）
│   ├── stylesheets/             # 主题微调
│   └── TNN-slug/
│       └── index.md             # 专题正文
├── mkdocs.yml                   # 站点配置 & 导航
├── requirements.txt             # Python 依赖（锁版本）
├── nixpacks.toml                # Railway 构建配置
├── LICENSE
└── README.md
```

新增专题：

1. 在 `docs/` 下新建 `TNN-slug/index.md`（编号只增不改）。
2. 在 `mkdocs.yml` 的 `nav` 节点对应分组下追加一行。
3. commit + push 即可。

## 内容生成工作流

1. 用 AI 生成或编辑专题 Markdown，公式用 `$...$` / `$$...$$` 包裹。
2. 写入对应 `docs/TNN-slug/index.md`。
3. 本地预览（见下节）确认无误。
4. `git commit && git push` —— Railway 监听 push，约 90 秒内重建上线。

## 本地预览

```bash
# 一次性安装依赖
pip install -r requirements.txt

# 启动本地预览服务（默认 http://127.0.0.1:8000）
mkdocs serve

# 仅构建静态产物到 site/
mkdocs build --strict
```

## Railway 部署

首次接入（一次性）：

1. Railway Dashboard → `New Project` → `Deploy from GitHub repo` → 选 `miracleyang-dev/ml-atlas`。
2. Railway 自动识别 `nixpacks.toml`，无需手填命令。
3. 服务 `Settings` → `Networking` → `Generate Domain` 拿到 `*.up.railway.app` 域名。
4. 默认监听 `main` 分支 push，后续无需再动。

更新流程：

```
本地撰写 Markdown → git push → Railway 自动 rebuild → 站点更新
```

## License

Content licensed under [CC BY-NC-SA 4.0](./LICENSE) — non-commercial use with attribution, share-alike.
