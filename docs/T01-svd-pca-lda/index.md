# 【T01】SVD / PCA / LDA

> 三者同源：都在求广义/特殊瑞利商 (Rayleigh quotient) 的极值。

---

## 00 前置记号与基础结论

### 记号约定

| 符号 | 含义 |
| --- | --- |
| $X \in \mathbb{R}^{n \times d}$ | 数据矩阵，**每行一个样本**（共 $n$ 个），$d$ 维特征 |
| $\bar{x} = \tfrac{1}{n} X^\top \mathbf{1}_n \in \mathbb{R}^{d}$ | 样本均值向量 |
| $\tilde{X} = X - \mathbf{1}_n \bar{x}^\top$ | 中心化数据矩阵 |
| $C = \tfrac{1}{n-1} \tilde X^\top \tilde X \in \mathbb{R}^{d \times d}$ | 样本协方差矩阵（无偏估计） |
| $\sigma_i, u_i, v_i$ | $X$ 的第 $i$ 个奇异值、左/右奇异向量 |
| $\lambda_i$ | 特征值（排序：$\lambda_1 \geq \lambda_2 \geq \dots$） |
| $\|A\|_F$ | Frobenius 范数，$\|A\|_F^2 = \mathrm{tr}(A^\top A) = \sum_{i} \sigma_i^2$ |
| $\|A\|_2$ | 谱范数，$\|A\|_2 = \sigma_{\max}(A)$ |

### 必备前置定理

**谱定理 (Spectral Theorem)**：任意实对称矩阵 $A = A^\top$ 可正交对角化 $A = Q \Lambda Q^\top$，$Q$ 列为单位正交特征向量，$\Lambda$ 为实特征值对角阵。若 $A$ 还半正定 (PSD)，所有 $\lambda_i \geq 0$。

**瑞利商 (Rayleigh Quotient)**：对实对称 $A$，

$$
R(A, w) = \frac{w^\top A w}{w^\top w}, \qquad \max_{w \neq 0} R = \lambda_{\max}(A), \quad \min_{w \neq 0} R = \lambda_{\min}(A).
$$

取极值的 $w$ 即对应特征向量。

**广义瑞利商**：对实对称 $A$、对称正定 $B$，$\max_{w} \frac{w^\top A w}{w^\top B w} = \lambda_{\max}(B^{-1} A)$，对应广义特征值问题 $A w = \lambda B w$。

**迹性质**：$\mathrm{tr}(AB) = \mathrm{tr}(BA)$；$\mathrm{tr}(A^\top B) = \langle A, B\rangle_F$；$\mathrm{tr}(A) = \sum_i \lambda_i$。

**常用求导**：$\nabla_w (w^\top A w) = (A + A^\top) w$，对称时为 $2Aw$。

---

## 01 问题定义与模型设定

三个任务串成一条线：**SVD 是矩阵分解工具；PCA 在 SVD 上加"最大方差"语义；LDA 在监督设定下改求广义瑞利商**。

### 1.1 SVD —— 纯矩阵分解
**任务**：对任意 $X \in \mathbb{R}^{n \times d}$，找到正交基使其线性映射在该基下退化为轴向缩放。无优化目标，是存在性定理。

### 1.2 PCA —— 无监督降维
**场景**：高维特征 $\to$ 低维表示，保留尽可能多的方差信息；可视化、噪声压缩、加速下游模型。
**变量**：单位方向 $w \in \mathbb{R}^d$，$\|w\|_2 = 1$。
**目标**：最大化投影后方差

$$
\boxed{\;\max_{\|w\|=1} \; \tfrac{1}{n-1}\sum_{i=1}^n (w^\top \tilde{x}_i)^2 \;=\; w^\top C w\;}
$$

取 top-$k$ 方向得到投影矩阵 $W = [w_1, \dots, w_k] \in \mathbb{R}^{d \times k}$，低维表示 $Z = \tilde X W \in \mathbb{R}^{n \times k}$。

### 1.3 LDA (Fisher) —— 监督降维 / 分类
**场景**：已知样本类标签 $y_i \in \{1, \dots, C\}$，求投影方向使"类间分得开、类内拉得紧"。
**散度矩阵**：

$$
S_W = \sum_{c=1}^C \sum_{i:\, y_i = c} (x_i - \mu_c)(x_i - \mu_c)^\top, \qquad S_B = \sum_{c=1}^C n_c (\mu_c - \mu)(\mu_c - \mu)^\top
$$

定义总散度 $S_T = \sum_{i=1}^n (x_i - \mu)(x_i - \mu)^\top$，则有 **散度分解定理**

$$
S_T \;=\; S_B + S_W.
$$

**证明**：对每个样本 $x_i$（设 $y_i = c$），插入并减去 $\mu_c$：

$$
(x_i - \mu)(x_i - \mu)^\top \;=\; \big[(x_i - \mu_c) + (\mu_c - \mu)\big]\big[(x_i - \mu_c) + (\mu_c - \mu)\big]^\top.
$$

展开为四项：(I) $(x_i - \mu_c)(x_i - \mu_c)^\top$，(II) $(x_i - \mu_c)(\mu_c - \mu)^\top$，(III) $(\mu_c - \mu)(x_i - \mu_c)^\top$，(IV) $(\mu_c - \mu)(\mu_c - \mu)^\top$。对 $i$ 在类 $c$ 内求和：

- 项 (I) 累计为 $\sum_{i:\,y_i=c}(x_i - \mu_c)(x_i - \mu_c)^\top$，所有类相加即 $S_W$。
- 项 (II) 中 $(\mu_c - \mu)^\top$ 与 $i$ 无关，提出后剩下 $\sum_{i:\,y_i=c}(x_i - \mu_c) = 0$（类内中心化），故为零；项 (III) 同理为零。
- 项 (IV) 累计为 $n_c (\mu_c - \mu)(\mu_c - \mu)^\top$，所有类相加即 $S_B$。

合并得 $S_T = S_W + S_B$。$\blacksquare$

这是概率论中 **全方差公式** $\mathrm{Var}(X) = \mathbb{E}[\mathrm{Var}(X \mid Y)] + \mathrm{Var}(\mathbb{E}[X \mid Y])$ 在样本散度矩阵上的直接对应。
**目标 (Fisher 准则)**：

$$
\boxed{\;\max_{w \neq 0}\; J(w) = \frac{w^\top S_B w}{w^\top S_W w}\;}
$$

---

## 02 完整数学推导

### 2.1 SVD 存在性

**定理**：任意 $X \in \mathbb{R}^{n \times d}$，$\mathrm{rank}(X) = r$，存在正交矩阵 $U \in \mathbb{R}^{n \times n}$、$V \in \mathbb{R}^{d \times d}$ 与"对角"矩阵 $\Sigma \in \mathbb{R}^{n \times d}$（$\Sigma_{ii} = \sigma_i$，$\sigma_1 \geq \dots \geq \sigma_r > 0 = \sigma_{r+1} = \dots$），使

$$
X = U \Sigma V^\top.
$$

**证明**：设 $p = \min(n, d)$。

**Step 1 · 构造 $V$**。$X^\top X \in \mathbb{R}^{d \times d}$ 实对称：$(X^\top X)^\top = X^\top X$；且半正定：对任意 $w$，$w^\top X^\top X w = \|Xw\|_2^2 \geq 0$。由谱定理，存在正交矩阵 $V \in \mathbb{R}^{d \times d}$，

$$
X^\top X \;=\; V \Lambda V^\top, \qquad \Lambda = \mathrm{diag}(\lambda_1, \dots, \lambda_d),\ \lambda_1 \geq \dots \geq \lambda_d \geq 0.
$$

记 $V = [v_1, \dots, v_d]$，每列满足 $X^\top X\, v_i = \lambda_i v_i$。

**Step 2 · 确定非零特征值个数**。断言 $\mathrm{Null}(X^\top X) = \mathrm{Null}(X)$：

- 若 $Xw = 0$，则 $X^\top X w = X^\top 0 = 0$。
- 若 $X^\top X w = 0$，则 $\|Xw\|^2 = w^\top X^\top X w = 0 \Rightarrow Xw = 0$。

因此 $\dim\mathrm{Null}(X^\top X) = d - \mathrm{rank}(X) = d - r$，故 $X^\top X$ 恰有 $r$ 个正特征值：$\lambda_1, \dots, \lambda_r > 0$，$\lambda_{r+1} = \dots = \lambda_d = 0$。

**Step 3 · 定义奇异值**。取

$$
\sigma_i := \sqrt{\lambda_i}, \qquad i = 1, \dots, p.
$$

排序自动满足 $\sigma_1 \geq \dots \geq \sigma_r > 0 = \sigma_{r+1} = \dots = \sigma_p$。

**Step 4 · 构造 $U$ 的前 $r$ 列**。对 $i = 1, \dots, r$（此时 $\sigma_i > 0$），定义

$$
u_i \;:=\; \frac{1}{\sigma_i}\, X v_i \;\in\; \mathbb{R}^n.
$$

**Step 5 · 验证 $\{u_1, \dots, u_r\}$ 正交单位**。对 $i, j \in \{1, \dots, r\}$，

$$
u_i^\top u_j \;=\; \frac{(X v_i)^\top (X v_j)}{\sigma_i \sigma_j} \;=\; \frac{v_i^\top (X^\top X) v_j}{\sigma_i \sigma_j} \;=\; \frac{\lambda_j\, v_i^\top v_j}{\sigma_i \sigma_j} \;=\; \frac{\sigma_j^2}{\sigma_i \sigma_j}\delta_{ij} \;=\; \delta_{ij}.
$$

**Step 6 · 扩充为正交基**。由 Gram–Schmidt，可把 $\{u_1, \dots, u_r\}$ 扩充为 $\mathbb{R}^n$ 的正交基 $\{u_1, \dots, u_n\}$。令 $U = [u_1 \mid \dots \mid u_n]$，则 $U^\top U = I_n$，$U$ 正交。

**Step 7 · 验证 $X v_i = \sigma_i u_i$ 对所有 $i$ 都成立**。

- $i \leq r$：来自定义。
- $r < i \leq d$：此时 $\lambda_i = 0$，所以 $\|X v_i\|^2 = v_i^\top X^\top X v_i = \lambda_i = 0$，即 $X v_i = 0$；而 $\sigma_i = 0$，故等式 $X v_i = 0 = \sigma_i \cdot u_i$ 平凡成立（$u_i$ 任选）。

**Step 8 · 写成矩阵形式**。构造 $\Sigma \in \mathbb{R}^{n \times d}$：$\Sigma_{ii} = \sigma_i$（$i \leq p$），其他元素 0。Step 7 的逐列等式合并为

$$
X V \;=\; U \Sigma.
$$

由 $V$ 正交（$VV^\top = I_d$）两边右乘 $V^\top$：

$$
X \;=\; U \Sigma V^\top. \qquad \blacksquare
$$

**唯一性说明**：奇异值 $\{\sigma_i\}$ 由 $X^\top X$ 的特征值唯一确定。在 $\sigma_i$ 互不相同的简单情形下，$v_i$ 与 $u_i$ 各自仅相差符号；若某个 $\sigma_i$ 是重根，对应的特征子空间唯一，但子空间内的正交基选取不唯一。

**紧凑 SVD (thin / economy)**：只保留前 $r$ 个非零奇异值，$X = U_r \Sigma_r V_r^\top$，$U_r \in \mathbb{R}^{n \times r}$，$V_r \in \mathbb{R}^{d \times r}$，$\Sigma_r \in \mathbb{R}^{r \times r}$；数值实现 (`numpy.linalg.svd(..., full_matrices=False)`) 默认走这一形态。

### 2.2 PCA 闭式解

构造拉格朗日：

$$
\mathcal{L}(w, \lambda) = w^\top C w - \lambda(w^\top w - 1).
$$

$$
\nabla_w \mathcal{L} = 2 C w - 2 \lambda w = 0 \implies \boxed{C w = \lambda w}.
$$

最优 $w^\star$ 是 $C$ 的最大特征值对应的特征向量；对应方差 $w^{\star\top} C w^\star = \lambda_{\max}(C)$。

**Top-$k$ 推广**：求

$$
\max_{W \in \mathbb{R}^{d \times k},\ W^\top W = I_k}\; \mathrm{tr}(W^\top C W).
$$

**定理 (Ky Fan 极大值原理)**：设实对称矩阵 $C$ 的特征值按降序排列 $\lambda_1 \geq \lambda_2 \geq \dots \geq \lambda_d$，则

$$
\max_{W^\top W = I_k}\; \mathrm{tr}(W^\top C W) \;=\; \sum_{i=1}^k \lambda_i,
$$

取等当且仅当 $W$ 的列向量张成 $C$ 的前 $k$ 个特征向量所生成的子空间。

**证明**：将 $C$ 谱分解为 $C = Q \Lambda Q^\top$，$Q = [q_1, \dots, q_d]$ 正交，$\Lambda = \mathrm{diag}(\lambda_1, \dots, \lambda_d)$。

**Step 1 · 换元**。令 $M = Q^\top W \in \mathbb{R}^{d \times k}$，则 $M^\top M = W^\top Q Q^\top W = W^\top W = I_k$，且

$$
\mathrm{tr}(W^\top C W) = \mathrm{tr}(W^\top Q \Lambda Q^\top W) = \mathrm{tr}(M^\top \Lambda M) = \sum_{i=1}^d \lambda_i \sum_{j=1}^k M_{ij}^2 = \sum_{i=1}^d \lambda_i \alpha_i,
$$

其中 $\alpha_i = \sum_j M_{ij}^2 \geq 0$ 表示第 $i$ 个特征方向在 $W$ 中被"使用"的权重。

**Step 2 · 权重约束**。由 $M^\top M = I_k$，$\sum_i \alpha_i = \mathrm{tr}(M^\top M) = k$；又由 $MM^\top$ 是正交投影矩阵（$k \leq d$ 时），其对角元 $\alpha_i = (MM^\top)_{ii} \in [0, 1]$。

**Step 3 · 线性规划上界**。在约束 $0 \leq \alpha_i \leq 1$、$\sum_i \alpha_i = k$、$\lambda_1 \geq \dots \geq \lambda_d$ 下，$\sum_i \lambda_i \alpha_i$ 的最大值显然在 $\alpha_1 = \dots = \alpha_k = 1$，$\alpha_{k+1} = \dots = 0$ 处取到（贪心地把权重塞给最大的特征值），最大值为 $\sum_{i=1}^k \lambda_i$。

**Step 4 · 达到上界**。取 $W = [q_1, \dots, q_k]$，则 $M = Q^\top W$ 的前 $k$ 行是 $I_k$，后 $d - k$ 行为零，对应 $\alpha_i = \mathbb{1}[i \leq k]$，取等。$\blacksquare$

回到 PCA：$C = \tfrac{1}{n-1}\tilde X^\top \tilde X$ 的特征向量是 $V$ 的列，故 top-$k$ 主成分即 $W^\star = [v_1, \dots, v_k]$，最大保留方差 $= \sum_{i=1}^k \lambda_i = \tfrac{1}{n-1}\sum_{i=1}^k \sigma_i^2$。

**与 SVD 等价**：将中心化数据做 SVD $\tilde X = U \Sigma V^\top$，则

$$
C = \frac{1}{n-1}\tilde X^\top \tilde X = \frac{1}{n-1} V \Sigma^2 V^\top,
$$

故 $w_i = v_i$（右奇异向量即主方向），$\lambda_i(C) = \sigma_i^2 / (n - 1)$。
**主成分得分**：$Z = \tilde X V_k = U_k \Sigma_k$。

### 2.3 LDA 闭式解

Fisher 准则对 $w$ 求导（$w \neq 0$，记分子 $a = w^\top S_B w$，分母 $b = w^\top S_W w$）：

$$
\nabla_w J = \frac{2 S_B w \cdot b - 2 S_W w \cdot a}{b^2} = 0 \implies S_B w = \tfrac{a}{b} S_W w = \lambda S_W w.
$$

即 **广义特征值问题**：

$$
\boxed{\; S_B w = \lambda S_W w \;}
$$

若 $S_W$ 可逆，等价于 $S_W^{-1} S_B w = \lambda w$；最优 $J$ 值 = $\lambda_{\max}(S_W^{-1} S_B)$。

**二分类闭式**：$C = 2$ 时

$$
S_B = \tfrac{n_1 n_2}{n}(\mu_1 - \mu_2)(\mu_1 - \mu_2)^\top
$$

是秩 1 的。由 $S_B w \propto (\mu_1 - \mu_2)$，得

$$
\boxed{\; w^\star \propto S_W^{-1}(\mu_1 - \mu_2) \;}.
$$

**多分类 ($C \geq 3$) 推广**：求前 $C-1$ 个广义特征向量构成投影矩阵 $W \in \mathbb{R}^{d \times (C-1)}$（见 §04 维度上限）。

---

## 03 几何直观解释

### SVD：旋转 → 缩放 → 旋转
$X = U \Sigma V^\top$ 把任意线性变换拆为三步：
1. $V^\top$：在输入空间做正交旋转，把"主方向"转到坐标轴。
2. $\Sigma$：沿坐标轴各向异性缩放（缩放因子即奇异值 $\sigma_i$）。
3. $U$：在输出空间做正交旋转。
**直观**：任何线性映射本质上都是"轴对齐缩放夹在两个旋转之间"。

### PCA：椭球的主轴
中心化后的数据云在协方差矩阵下呈现一个**椭球**（高斯近似）；椭球的主轴方向 = $C$ 的特征向量；主轴半长 = $\sqrt{\lambda_i}$。PCA 取最长几根主轴，把数据投到这些轴张成的子空间，是**最小化重构误差**与**最大化保留方差**的同一件事。

### LDA：让类标签自身定方向
PCA 只看"数据云怎么伸展"，不在乎类标签——伸展最大的方向可能恰好不利于分类。LDA 引入标签，把目标改成"投影后**类心**之间距离最大、**同类**点彼此最近"，几何上是在多个类质心连线张成的子空间里挑方向。

---

## 04 核心性质与关键定理

### 4.1 Eckart–Young–Mirsky 最佳低秩逼近
设 $X = U\Sigma V^\top$，对任意 $k \leq \mathrm{rank}(X)$，定义截断 SVD

$$
X_k = \sum_{i=1}^k \sigma_i u_i v_i^\top.
$$

则在 Frobenius 范数与谱范数下，$X_k$ 都是 $X$ 在 rank-$k$ 约束下的最佳逼近：

$$
\|X - X_k\|_F^2 = \sum_{i=k+1}^{r} \sigma_i^2, \qquad \|X - X_k\|_2 = \sigma_{k+1}.
$$

**证明 (Frobenius 范数情形)**：要证对任意秩不超过 $k$ 的 $B$，

$$
\|X - B\|_F^2 \;\geq\; \sum_{i=k+1}^{r} \sigma_i^2.
$$

**Step 1 · 残差的 SVD 视角**。由 $\|A\|_F^2 = \sum_i \sigma_i(A)^2$（Frobenius 范数 = 奇异值平方和，且在正交变换下不变）。

**Step 2 · Weyl 奇异值不等式**。对任意同型矩阵 $A_1, A_2$ 与正整数 $i, j$ 满足 $i + j - 1 \leq \min(n, d)$，

$$
\sigma_{i+j-1}(A_1 + A_2) \;\leq\; \sigma_i(A_1) + \sigma_j(A_2).
$$

令 $A_1 = X - B$、$A_2 = B$，代入 $j = k + 1$。由 $\mathrm{rank}(B) \leq k$ 知 $\sigma_{k+1}(B) = 0$，故

$$
\sigma_{i+k}(X) \;\leq\; \sigma_i(X - B), \qquad i = 1, 2, \dots, r - k.
$$

**Step 3 · 求和**。

$$
\|X - B\|_F^2 = \sum_{i \geq 1} \sigma_i(X - B)^2 \;\geq\; \sum_{i \geq 1} \sigma_{i+k}(X)^2 = \sum_{i = k+1}^{r} \sigma_i^2.
$$

**Step 4 · 取等**。直接代入 $B = X_k$：$X - X_k = \sum_{i=k+1}^r \sigma_i u_i v_i^\top$ 仍是 SVD 形式，奇异值即 $\{\sigma_{k+1}, \dots, \sigma_r\}$，所以 $\|X - X_k\|_F^2 = \sum_{i=k+1}^{r} \sigma_i^2$。$\blacksquare$

**谱范数情形**：由 Step 2 取 $i = 1$，$\sigma_{k+1}(X) \leq \sigma_1(X - B) = \|X - B\|_2$；取等也由 $B = X_k$ 给出 $\|X - X_k\|_2 = \sigma_{k+1}$。

**意义**：PCA 用前 $k$ 主成分重构 $\tilde X$ 的均方误差恰为 $\sum_{i>k} \sigma_i^2 / (n-1)$；信号压缩、矩阵补全、推荐系统中的潜因子模型本质上都是它。

### 4.2 PCA 的几个等价表述
- **最大投影方差**（§2.2 推导）
- **最小重构误差**：$\min_{W^\top W = I_k} \| \tilde X - \tilde X W W^\top \|_F^2$
- **互信息最大**（高斯假设下）
- **协方差矩阵的迹分解**：$\mathrm{tr}(C) = \sum_i \lambda_i$，前 $k$ 个特征值之和 / $\mathrm{tr}(C)$ 即"解释方差比"。

### 4.3 LDA 的维度上限

**命题**：$\mathrm{rank}(S_B) \leq C - 1$，故 LDA 最多得到 $C - 1$ 个非零广义特征值，投影维度上限为 $C - 1$。

**证明**：把 $S_B$ 写成外积之和形式。令 $d_c = \sqrt{n_c}(\mu_c - \mu) \in \mathbb{R}^d$，$c = 1, \dots, C$，并将其拼成矩阵 $D = [d_1, \dots, d_C] \in \mathbb{R}^{d \times C}$，则

$$
S_B \;=\; \sum_{c=1}^C n_c (\mu_c - \mu)(\mu_c - \mu)^\top \;=\; \sum_{c=1}^C d_c d_c^\top \;=\; D D^\top.
$$

由 $\mathrm{rank}(D D^\top) = \mathrm{rank}(D)$，只需估计 $\mathrm{rank}(D) \leq C - 1$。

**约束**：全样本均值满足 $\mu = \tfrac{1}{n} \sum_c n_c \mu_c$，即

$$
\sum_{c=1}^C n_c (\mu_c - \mu) \;=\; \sum_c n_c \mu_c - n \mu \;=\; 0.
$$

两边除以 $\sqrt{n_c}$ 系数整理：将 $n_c (\mu_c - \mu) = \sqrt{n_c}\, d_c$ 代回得到

$$
\sum_{c=1}^C \sqrt{n_c}\, d_c \;=\; 0,
$$

即 $D$ 的 $C$ 列存在非零线性组合等于零，所以列空间维度 $\leq C - 1$，即 $\mathrm{rank}(D) \leq C - 1$。

因此 $\mathrm{rank}(S_B) = \mathrm{rank}(D) \leq C - 1$。$\blacksquare$

**推论**：$S_W^{-1} S_B$（在 $S_W$ 可逆时）至多有 $C - 1$ 个非零特征值，对应至多 $C - 1$ 个有效投影方向；二分类只能投到一维。

### 4.4 Moore–Penrose 伪逆

$$
X^+ = V \Sigma^+ U^\top, \quad (\Sigma^+)_{ii} = \begin{cases} 1/\sigma_i, & \sigma_i > 0 \\ 0, & \sigma_i = 0 \end{cases}
$$

满足 $XX^+ X = X$、$X^+ X X^+ = X^+$，且 $(XX^+)^\top = XX^+$、$(X^+X)^\top = X^+X$。最小二乘 $\min_\beta \|X\beta - y\|_2^2$ 的最小范数解为 $\beta^\star = X^+ y$。

### 4.5 与中心化的关系
不中心化的"PCA"等价于对 $X^\top X$ 做特征分解，得到的第一主方向通常贴近**样本均值方向**，缺乏统计意义。务必先减均值。

---

## 05 工程实战要点

### 5.1 数值稳定：永远走 SVD，别构造协方差矩阵
- 直接对 $\tilde X / \sqrt{n-1}$ 做 SVD，再取右奇异向量为主方向，奇异值平方即特征值。
- 构造 $\tilde X^\top \tilde X$ 再特征分解，**条件数被平方**（$\kappa(X^\top X) = \kappa(X)^2$），小奇异值精度灾难性损失。
- `numpy.linalg.svd` / `scipy.linalg.svd` 内部走双对角化 + 隐式 QR，是工业级稳健做法。

### 5.2 $S_W$ 奇异：高维小样本陷阱
- 场景：人脸识别 $n \sim 10^2$、$d \sim 10^4$，则 $\mathrm{rank}(S_W) \leq n - C \ll d$，$S_W$ 必奇异。
- **Fisherfaces (Belhumeur 1997)**：先 PCA 把 $d$ 降到 $\leq n - C$，再在 PCA 子空间里做 LDA。
- **正则化 LDA**：用 $\hat S_W = S_W + \alpha I$ 替代，$\alpha$ 交叉验证选。
- **广义 SVD / 伪逆**：当 $S_W$ 不可逆时用 $S_W^+$，但需谨慎处理零空间。

### 5.3 尺度敏感与预处理
- PCA 受特征尺度影响极大（量纲不同会主导主成分）。**标配**：先按列做 Z-score 标准化（即对相关矩阵做 PCA）。
- LDA 同样建议标准化；非高斯/类协方差差异大时退化为 QDA 或换核方法。

### 5.4 大规模 / 流式数据
- **Randomized SVD** (Halko–Martinsson–Tropp 2011)：用 $\mathcal{O}(ndk)$ 时间得到 top-$k$ 近似 SVD，误差有概率上界。`sklearn.decomposition.PCA(svd_solver="randomized")` 默认走这条路。
- **Incremental PCA**：分块更新协方差或秩-$k$ 子空间，适合流式数据。
- **Truncated SVD**（不去均值）：稀疏文本 TF–IDF 场景标配（LSA / LSI）。

### 5.5 常见踩坑清单
| 现象 | 原因 | 解法 |
| --- | --- | --- |
| 主成分方向逐次符号翻转 | SVD 符号不唯一 | 不影响方差/重构；如需可复现，固定每列最大绝对值元素为正 |
| `eig` 返回复数特征值 | 浮点对称性丢失 | 用 `eigh`（专用于对称矩阵） |
| 第一主成分等于均值方向 | 忘了中心化 | 先减 $\bar x$ |
| LDA 维度想 > $C-1$ | 触碰 $S_B$ 秩上限 | 改 PCA 或用核 LDA |

---

## 06 统一对比框架

| 方法 | 监督属性 | 核心方程 | 最大有效维度 | 核心目标 | 推荐计算方案 |
| --- | --- | --- | --- | --- | --- |
| **SVD** | — (分解) | $X = U\Sigma V^\top$ | $\mathrm{rank}(X) \leq \min(n,d)$ | 存在性定理 / 最佳低秩逼近 | LAPACK 双对角化；大矩阵用 Randomized SVD |
| **PCA** | 无监督 | $Cw = \lambda w$ 等价于 $\tilde X = U\Sigma V^\top$ | $\min(n-1, d)$ | 最大化投影方差 / 最小化重构误差 | 对 $\tilde X / \sqrt{n-1}$ 做 SVD |
| **LDA** | 监督 | $S_B w = \lambda S_W w$ | $C - 1$ | 最大化类间/类内散度比 (Fisher 准则) | `scipy.linalg.eigh(S_B, S_W)`，必要时先 PCA 预降维 |

---

## 07 速记总结

> **SVD 是工具，PCA 在 SVD 上加"最大方差"语义，LDA 在 SVD/PCA 之外引入类标签求广义瑞利商最大化。三者本质都在解（广义）特征值问题，最优解都靠瑞利商极值原理。**

---

## 附录: 极简 Python 代码

```python
import numpy as np

# ---------- PCA ----------
def pca(X, k):
    Xc = X - X.mean(axis=0, keepdims=True)         # 中心化
    U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
    components = Vt[:k]                             # (k, d)
    explained_var = (S[:k] ** 2) / (X.shape[0] - 1)
    Z = Xc @ components.T                           # 投影 (n, k)
    return Z, components, explained_var

# ---------- LDA (multi-class) ----------
def lda(X, y, k):
    classes = np.unique(y)
    mu = X.mean(axis=0)
    Sw = np.zeros((X.shape[1], X.shape[1]))
    Sb = np.zeros_like(Sw)
    for c in classes:
        Xc = X[y == c]
        mu_c = Xc.mean(axis=0)
        Sw += (Xc - mu_c).T @ (Xc - mu_c)
        diff = (mu_c - mu).reshape(-1, 1)
        Sb += len(Xc) * (diff @ diff.T)
    from scipy.linalg import eigh
    # eigh 解广义特征值: Sb w = lambda Sw w
    eigvals, eigvecs = eigh(Sb, Sw)
    order = np.argsort(eigvals)[::-1]               # 从大到小
    W = eigvecs[:, order[:k]]                       # (d, k)
    return X @ W, W
```
