# machine-learning-handbook

> A modular knowledge base of deep-learning fundamentals and mathematical prerequisites, maintained as a continuously-updated reference site.

按主题模块化的深度学习与机器学习及相关数学基础在线知识库，基于 MkDocs Material 构建，托管在 Railway，提交即自动部署。

## 在线访问

- 主站：<https://machine-learning-handbook.up.railway.app>（部署完成后生效）

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 内容 | Markdown + KaTeX | 纯文本，AI 可直接生成 |
| 框架 | MkDocs Material 9.x | Python 构建，分组导航 + 顶部 tabs |
| 公式 | pymdownx.arithmatex + KaTeX | 轻量、渲染快 |
| 托管 | Railway (Nixpacks) | push 触发自动重建 |

## 目录规范

```
machine-learning-handbook/
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

1. Railway Dashboard → `New Project` → `Deploy from GitHub repo` → 选 `miracleyang-dev/machine-learning-handbook`。
2. Railway 自动识别 `nixpacks.toml`，无需手填命令。
3. 服务 `Settings` → `Networking` → `Generate Domain` 拿到 `*.up.railway.app` 域名。
4. 默认监听 `main` 分支 push，后续无需再动。

更新流程：

```
本地撰写 Markdown → git push → Railway 自动 rebuild → 站点更新
```

## 仓库改名清单

以下以新仓库名 `machine-learning-handbook` 为例；如果最终使用其他名称，把命令和配置里的名字同步替换。

### GitHub

1. 进入仓库 `Settings` → `General` → `Repository name`。
2. 将仓库名从 `ml-atlas` 改为 `machine-learning-handbook`。
3. 确认 GitHub 自动生成的重定向可用后，再同步项目内引用：
   - `mkdocs.yml` 的 `repo_url` / `repo_name`
   - `README.md` 中的仓库名、目录名、部署说明

### Railway

1. 进入当前 Railway Project，确认服务仍连接到 GitHub 仓库。
2. 如果 Source Repo 仍显示旧仓库名但构建正常，可以保留；如果构建失败，重新选择 `miracleyang-dev/machine-learning-handbook`。
3. 如需更换 Railway 服务名或公开域名，在 `Settings` → `Networking` 中处理。
4. 如果公开域名发生变化，同步更新：
   - `mkdocs.yml` 的 `site_url`
   - `README.md` 的“在线访问”链接

### 本地 Git

1. 可选：把本地目录从 `ml-atlas` 改名为 `machine-learning-handbook`。
2. 更新远程地址：

```bash
git remote set-url origin git@github.com:miracleyang-dev/machine-learning-handbook.git
```

如果使用 HTTPS：

```bash
git remote set-url origin https://github.com/miracleyang-dev/machine-learning-handbook.git
```

3. 检查远程地址：

```bash
git remote -v
```

4. 推送前确认构建通过，再正常提交和推送。

## License

Content licensed under [CC BY-NC-SA 4.0](./LICENSE) — non-commercial use with attribution, share-alike.
